angular.module('fitpatrol.services', ['http-auth-interceptor'])
.factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend, localStorage) {
  var service = {
    login: function(user) {
      $http.post(API_URL + "sign_in", user, { ignoreAuthModule: true })
      .success(function (data, status, headers, config) {
    	$http.defaults.headers.common.Authorization = data.authorizationToken;  // Step 1

    	// Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          return config;
        });
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', data, status);
      });
    },
    logout: function(user) {
      $http.delete(API_URL + "sign_out", { ignoreAuthModule: true })
      .finally(function(data) {
        localStorage.setObject('user', {});
        $rootScope.$broadcast('event:auth-logout-complete');
      });
    },
    loginCancelled: function() {
      authService.loginCancelled();
    },
    signup: function(signupData) {
      $http.post(API_URL + "sign_up", signupData, { ignoreAuthModule: true })
      .success(function (data, status, headers, config) {
      $http.defaults.headers.common.Authorization = data.authorizationToken;  // Step 1

      // Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = data.authorizationToken;
          return config;
        });
        $rootScope.$broadcast('event:auth-signup-confirmed', data, status);
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-signup-failed', data, status);
      });
    },

    getTrainers : function(success) {
      $http.get(API_URL + "trainers")
      .success(success)
      .error(function(data){
      });
    },

    getTrainerProfile : function(id, success) {
      $http.get(API_URL + "trainers/" + id + "/profile")
      .success(success)
      .error(function(data){
      });
    },

    getUserProfile : function(rolable_type, success) {
      $http.get(API_URL + rolable_type.toLowerCase() + "/me")
      .success(success)
      .error(function(data){
      });
    }
  };
  return service;
})
