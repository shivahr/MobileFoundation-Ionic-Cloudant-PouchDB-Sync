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
}
