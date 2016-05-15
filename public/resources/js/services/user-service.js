/* global angular, btoa */

/*
 * user-service.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";
  /**
   * Service for user related tasks.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module('taskplanner').factory('UserService', UserService);

  UserService.$inject = ['$q', '$http'];

  /**
   * User Service implementation
   * 
   * @class
   * @name UserService
   * @param {Object} $q - The $q service
   * @param {Object} $http - The $http service
   */
  function UserService($q, $http) {

    /**
     * The base REST URL.
     * 
     * @fieldOf UserService#
     * @private
     * @type string
     */
    var REST_BASE_PATH = 'user';

    /**
     * The service interface
     * 
     * @fieldOf UserService#
     * @private
     * @interface
     */
    var service = {
      saveUser: saveUser,
      changePassword: changePassword
    };

    return service;

    /**
     * Save the given user.
     * 
     * @memberOf UserService#
     * @param {Object} user - The user to be saved
     */
    function saveUser(user) {
      var deferred = $q.defer();

      $http.post(REST_BASE_PATH, {
        user: user
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    }

    /**
     * Update the password of the given user.
     * 
     * @memberOf UserService#
     * @param {Object} user - The user to be modified
     * @param {string} newPassword - The new password
     */
    function changePassword(user, newPassword) {
      var deferred = $q.defer();

      $http.post(REST_BASE_PATH + '/chpass', {
        user: user,
        password: newPassword
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    }
  }

})();
