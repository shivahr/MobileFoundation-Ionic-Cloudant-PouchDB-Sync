function getPeople() {
    var path = 'employees' + '/_all_docs?include_docs=true';
    var input = {
        method : 'get',
        returnedContentType : 'json',
        path : path,
    };
    var response = MFP.Server.invokeHttp(input);
    if (!response.rows) {
        response.isSuccessful = false;
        return response;
    } else {
        var results = [];
        for (var i=0; i < response.rows.length; i++) {
            results.push(response.rows[i].doc);
        }
        return {'rows': results};
    }
}

function getCloudantCredentials() {
  return {
    'url': MFP.Server.getPropertyValue("DB_url"),
    'username': MFP.Server.getPropertyValue("DB_username"),
    'password': MFP.Server.getPropertyValue("DB_password"),
  };
}
