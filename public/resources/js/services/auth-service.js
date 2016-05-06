/* global angular, btoa */

/*
 * auth-service.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";
  /**
   * Service for authentication.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module('taskplanner').factory('AuthService', AuthService);

  AuthService.$inject = ['$rootScope', '$window', '$q', '$http', '$state', '$location', '$translate'];

  /**
   * Authentication Service implementation
   * 
   * @class
   * @name AuthService
   * @param {Object} $rootScope - The application wide root scope
   * @param {Object} $window - The $window service
   * @param {Object} $q - The $q service
   * @param {Object} $http - The $http service
   * @param {Object} $state - The $state service
   * @param {Object} $location - The $location service
   * @param {Object} $translate - The $translate service
   */
  function AuthService($rootScope, $window, $q, $http, $state, $location, $translate) {

    /**
     * The currently authenticated user.
     */
    var authenticatedUser;

    /**
     * The base REST URL.
     * 
     * @fieldOf AuthService#
     * @private
     * @type string
     */
    var REST_BASE_PATH = 'auth';

    /**
     * The service interface
     * 
     * @fieldOf AuthService#
     * @private
     * @interface
     */
    var service = {
      login: login,
      logout: logout,
      loadUser: loadUser,
      getUser: getUser,
      getToken: getToken
    };

    return service;

    /**
     * Login a user with the given username and password.
     * 
     * @memberOf AuthService
     * @param {string} username - The username
     * @param {string} password - The password
     */
    function login(username, password) {
      $http.post(REST_BASE_PATH + '/login', {
        username: username,
        password: password,
      }).then(function(response) {
        var data = response.data;
        authenticatedUser = data.user;
        $window.sessionStorage.token = data.token;
        $translate.use(authenticatedUser.language);
        $rootScope.$broadcast('authentication');
        $state.go('home', {
          owner: authenticatedUser.username
        });
      }, function() {
        // Error: authentication failed
      });
    }

    /**
     * Log the current user out.
     * 
     * @memberOf AuthService
     */
    function logout() {
      $http.post(REST_BASE_PATH + '/logout').then(function() {
        delete $window.sessionStorage.token;
        authenticatedUser = undefined;
        window.location = '/';
        $rootScope.$broadcast('authentication');
        $translate.use($translate.preferredLanguage());
      }, function() {
        delete $window.sessionStorage.token;
        authenticatedUser = undefined;
        $rootScope.$broadcast('authentication');
        window.location = '/';
        $translate.use($translate.preferredLanguage());
      });
    }

    /**
     * Load the currently authenticated user.
     * 
     * @memberOf AuthService
     * @returns A promise containing the currently authenticated user
     */
    function loadUser() {
      var deferred = $q.defer();

      if (authenticatedUser) {
        deferred.resolve(authenticatedUser);
      } else {
        var token = $window.sessionStorage.token;
        if (token) {
          $http.post(REST_BASE_PATH + '/loaduser', {
            token: token
          }).then(function(response) {
            var data = response.data;
            if (data && data.user) {
              authenticatedUser = data.user;
              $window.sessionStorage.token = data.token;
              $rootScope.$broadcast('authentication');
              $translate.use(authenticatedUser.language);
              deferred.resolve(authenticatedUser);
            } else {
              deferred.resolve();
            }
          }, function() {
            deferred.reject();
          });
        } else {
          deferred.resolve();
        }
      }

      return deferred.promise;
    }

    /**
     * Get the currently authenticated user or undefined if no user is
     * available.
     * 
     * @memberOf AuthService
     * @returns The currently authenticated user or undefined
     */
    function getUser() {
      return authenticatedUser;
    }

    /**
     * Get the Bearer token from session storage.
     * 
     * @memberOf AuthService
     * @returns The Bearer token or undefined if no token is available
     */
    function getToken(encoded) {
      if ($window.sessionStorage.token) {
        var token = 'Bearer ' + $window.sessionStorage.token;
        return encoded ? btoa(token) : token;
      }

      return undefined;
    }
  }

})();
