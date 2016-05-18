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

  TaskListService.$inject = ['$rootScope', '$q', '$http', '$window', '$translate', 'AuthService'];

  /**
   * Task List Service implementation
   * 
   * @class
   * @name TaskListService
   * @param {Object} $rootScope - The application wide root scope
   * @param {Object} $q - The $q service
   * @param {Object} $http - The $http service
   * @param {Object} $window - The $window service
   * @param {Object} $translate - The $translate service
   * @param {Object} AuthService - The authentication service
   */
  function TaskListService($rootScope, $q, $http, $window, $translate, AuthService) {

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
     * @fieldOf TaskListService#
     * @private
     * @interface
     */
    var service = {
      list: list,
      save: save,
      saveTasks: saveTasks,
      remove: remove,
      exportTasks: exportTasks
    };

    return service;

    /**
     * List all task lists of the current user.
     * 
     * @memberOf TaskListService#
     * @returns A promise resolving to the HTTP response data
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
     * @returns A promise resolving to the HTTP response data
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
     * Save the tasks of a specific task list.
     * 
     * @memberOf TaskListService#
     * @param {Object} taskList - The taskList to be saved
     * @returns A promise resolving to the HTTP response data
     */
    function saveTasks(taskList) {
      var deferred = $q.defer();

      $http.post(REST_BASE_PATH + '/tasks', {
        taskListId: taskList._id,
        tasks: taskList.tasks
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
     * @returns A promise resolving to the HTTP response data
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

    /**
     * Export all tasks of the given task list.
     * 
     * @memberOF TaskListService#
     * @param {Object} taskList - The taskList to be exported
     */
    function exportTasks(taskList) {
        $window.open(REST_BASE_PATH + '/export?tl=' + taskList._id + '&t=' + AuthService.getToken(true));
    }
  }

})();
