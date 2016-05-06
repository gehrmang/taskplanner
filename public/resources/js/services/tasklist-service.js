/* global angular, btoa */

/*
 * tasklist-service.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";
  /**
   * Service for task list related tasks.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module('taskplanner').factory('TaskListService', TaskListService);

  TaskListService.$inject = ['$rootScope', '$q', '$http', '$translate'];

  /**
   * Task List Service implementation
   * 
   * @class
   * @name TaskListService
   * @param {Object} $rootScope - The application wide root scope
   * @param {Object} $q - The $q service
   * @param {Object} $http - The $http service
   * @param {Object} $translate - The $translate service
   */
  function TaskListService($rootScope, $q, $http, $translate) {

    /**
     * The base REST URL.
     * 
     * @fieldOf TaskListService#
     * @private
     * @type string
     */
    var REST_BASE_PATH = 'task';

    /**
     * The service interface
     * 
     * @fieldOf AuthService#
     * @private
     * @interface
     */
    var service = {
      list: list,
      save: save,
      remove: remove
    };

    return service;

    /**
     * List all task lists of the current user.
     * 
     * @memberOf TaskListService#
     */
    function list() {
      var deferred = $q.defer();

      $http.get(REST_BASE_PATH).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    }

    /**
     * Save the given task list.
     * 
     * @memberOf TaskListService#
     * @param {Object} taskList - The taskList to be saved
     */
    function save(taskList) {
      var deferred = $q.defer();

      $http.post(REST_BASE_PATH, {
        taskList: taskList
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    }

    /**
     * Remove the given task list.
     * 
     * @memberOf TaskListService#
     * @param {Object} taskList - The taskList to be removed
     */
    function remove(taskList) {
      var deferred = $q.defer();

      $http({
        url: REST_BASE_PATH,
        method: 'DELETE',
        params: {
          tl: taskList._id
        }
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    }
  }

})();
