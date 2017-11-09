/// <reference path="../../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
/// <reference path="../../../plugins/cordova-plugin-mfp-jsonstore/typings/jsonstore.d.ts" />
import { Injectable } from '@angular/core';

var isChallenged = false;
var handleChallengeCallback = null;
var loginSuccessCallback = null;
var loginFailureCallback = null;

@Injectable()
export class AuthHandlerProvider {
  securityCheckName = 'UserLogin';
  userLoginChallengeHandler;
  initialized = false;

  constructor() {
  }

  // Reference: https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/authentication-and-security/credentials-validation/javascript/
  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    console.log('--> AuthHandler init() called');

    this.userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(this.securityCheckName);

    this.userLoginChallengeHandler.handleChallenge = function(challenge) {
      console.log('--> AuthHandler handleChallenge called');
      isChallenged = true;

      console.log('--> remainingAttempts: ', challenge.remainingAttempts);
      var statusMsg = 'Remaining attempts: ' + challenge.remainingAttempts;
      if (challenge.errorMsg !== null) {
        console.log('--> errorMsg: ', challenge.errorMsg);
        statusMsg += '<br>' + challenge.errorMsg;
        if (loginFailureCallback != null) {
          loginFailureCallback({'failure': statusMsg});
        }
      }

      if (handleChallengeCallback != null) {
        handleChallengeCallback();
      } else {
        console.log('--> handleChallengeCallback not set!');
      }
    };

    this.userLoginChallengeHandler.handleSuccess = function(data) {
      console.log('--> AuthHandler handleSuccess called');
      isChallenged = false;

      if (loginSuccessCallback != null) {
        loginSuccessCallback();
      } else {
        console.log('--> loginSuccessCallback not set!');
      }
    };

    this.userLoginChallengeHandler.handleFailure = function(error) {
      console.log('--> AuthHandler handleFailure called' + error.failure);
      isChallenged = false;

      if (loginFailureCallback != null) {
        loginFailureCallback(error);
      } else {
        console.log('--> loginFailureCallback not set!');
      }
    };
  }

  setCallbacks(onSuccess, onFailure, onHandleChallenge) {
    console.log('--> AuthHandler setCallbacks called');
    loginSuccessCallback = onSuccess;
    loginFailureCallback = onFailure;
    handleChallengeCallback = onHandleChallenge;
  }

  // Reference: https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/authentication-and-security/user-authentication/javascript/
  checkIsLoggedIn() {
    console.log('--> AuthHandler checkIsLoggedIn called');
    WLAuthorizationManager.obtainAccessToken('UserLogin')
    .then(
      (accessToken) => {
        console.log('--> obtainAccessToken onSuccess');
      },
      (error) => {
        console.log('--> obtainAccessToken onFailure: ' + JSON.stringify(error));
      }
    );
  }

  login(username, password) {
    console.log('--> AuthHandler login called');
    console.log('--> isChallenged: ', isChallenged);
    if (isChallenged) {
      this.userLoginChallengeHandler.submitChallengeAnswer({'username':username, 'password':password});
    } else {
      WLAuthorizationManager.login(this.securityCheckName, {'username':username, 'password':password})
      .then(
        (success) => {
          console.log('--> login success');
        },
        (failure) => {
          console.log('--> login failure: ' + JSON.stringify(failure));
        }
      );
    }
  }

  logout() {
    console.log('--> AuthHandler logout called');
    WLAuthorizationManager.logout(this.securityCheckName)
    .then(
      (success) => {
        console.log('--> logout success');
      },
      (failure) => {
        console.log('--> logout failure: ' + JSON.stringify(failure));
      }
    );
  }

  userCredentialsCollectionName = 'userCredentials';
  collections = {
    userCredentials: {
      searchFields: {username: 'string'}
    }
  }

  storeCredentialsInJSONStore(username, password) {
    console.log('--> storeCredentialsInJSONStore called');

    let authData = {
      username: username,
      password: password,
      localKeyGen: true
    }

    // https://www.ibm.com/support/knowledgecenter/en/SSHS8R_8.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-client/html/WL.JSONStore.html
    WL.JSONStore.closeAll({});
    WL.JSONStore.init(this.collections, authData).then((success) => {
      WL.JSONStore.get(this.userCredentialsCollectionName).count({}, {}).then((countResult) => {
        if (countResult == 0) {
          // The JSONStore collection is empty, populate it.
          WL.JSONStore.get(this.userCredentialsCollectionName).add(authData, {});
          console.log('--> JSONStore collection populated with user-credentials')
        }
      })
    },(failure) => {
      console.log('--> password change detected - destroying JSONStore to recreate it', failure)
      WL.JSONStore.destroy(username);
      this.storeCredentialsInJSONStore(username, password);
    })
  }

  offlineLogin(username, password, loginSuccessCallback, loginFailureCallback) {
    console.log('--> offlineLogin called');

    let authData = {
      username: username,
      password: password,
      localKeyGen: true
    }

    WL.JSONStore.closeAll({});
    WL.JSONStore.init(this.collections, authData).then((success) => {
      WL.JSONStore.get(this.userCredentialsCollectionName).count({}, {}).then((countResult) => {
        if (countResult == 0) {
          WL.JSONStore.destroy(username);
          console.log('--> offlineLogin failed - First time login must be done when Internet connection is available')
          loginFailureCallback({'failure': 'First time login must be done when Internet connection is available'});
        } else {
          console.log('--> offlineLogin success')
          loginSuccessCallback();
        }
      })
    },(failure) => {
      console.log('--> offlineLogin failed - invalid username/password ', failure)
      loginFailureCallback({'failure': 'invalid username/password'});
    })
  }

}
