/**
 * Copyright 2017 IBM Corp.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.mycity.myward;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.api.types.Facing;
import org.openstack4j.model.common.Identifier;
import org.openstack4j.model.identity.v3.Endpoint;
import org.openstack4j.model.identity.v3.Service;
import org.openstack4j.model.identity.v3.Token;
import org.openstack4j.openstack.OSFactory;

import com.ibm.mfp.adapter.api.ConfigurationAPI;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Api(value = "Object Storage")
@Path("/getObjectStorageAuthToken")
public class ObjectStorageAdapterResource {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(ObjectStorageAdapterResource.class.getName());

	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;

	/*
	 * Path for method: "<server address>/mfp/api/adapters/ObjectStorageAdapter/getObjectStorageAuthToken"
	 */
	@ApiOperation(value = "Returns X-Auth-Token and URL of REST API endpoint for CRUD operations on objects", notes = "Append object name at the end of URL and specify X-Auth-Token as a header for REST API calls on objects.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "A JSON object containing objectUrl and xAuthToken.") })
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAuthToken() {
		// https://github.com/ibm-bluemix-mobile-services/bluemix-objectstorage-sample-liberty
		String OBJECT_STORAGE_AUTH_URL = "https://identity.open.softlayer.com/v3";
		String projectId = configApi.getPropertyValue("projectId");
		String userId = configApi.getPropertyValue("userId");
		String password = configApi.getPropertyValue("password");
		String region = configApi.getPropertyValue("region");
		String containerName = configApi.getPropertyValue("containerName");

		logger.info("Authenticating with ObjectStorage...");
		OSClientV3 os = OSFactory.builderV3().endpoint(OBJECT_STORAGE_AUTH_URL).credentials(userId, password)
				.scopeToProject(Identifier.byId(projectId)).authenticate();
		logger.info("Authenticated successfully with ObjectStorage!");

		Token token = os.getToken();
		String xAuthToken = token.getId();
		logger.info("X-Auth-Token = " + xAuthToken);

		// https://stackoverflow.com/questions/40385145/get-uploaded-object-url-using-openstack4j
		String objectUrl = "";
		List<Service> services = (List<Service>) token.getCatalog();
		for (int i = 0; i < services.size(); i++) {
			Service s = services.get(i);
			if (s.getName().equals("swift")) {
				for (Endpoint e : s.getEndpoints()) {
					if (e.getRegion().equals(region) && e.getIface().equals(Facing.PUBLIC)) {
						objectUrl = e.getUrl().toString() + "/" + containerName + "/";
						break;
					}
				}
			}
		}
		logger.info("ObjectURL = " + objectUrl);

		Map<String, String> result = new HashMap<String, String>();

		result.put("xAuthToken", xAuthToken);
		result.put("objectUrl", objectUrl);
		return Response.ok(result, MediaType.APPLICATION_JSON).build();
	}

}
