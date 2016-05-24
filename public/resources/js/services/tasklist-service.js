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
      listShared: listShared,
      save: save,
      saveTask: saveTask,
      remove: remove,
      removeTask: removeTask,
      exportTasks: exportTasks,
      addWatcher: addWatcher,
      removeWatcher: removeWatcher
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
     * List all shared task lists.
     * 
     * @memberOf TaskListService#
     * @returns A promise resolving to the HTTP response data
     */
    function listShared() {
      var deferred = $q.defer();

      $http.get(REST_BASE_PATH + '/shared').then(function(response) {
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
     * Save the given task of a specific task list.
     * 
     * @memberOf TaskListService#
     * @param {Object} taskListId - The ID of the task list
     * @param {Object} task - The task to be saved
     * @returns A promise resolving to the HTTP response data
     */
    function saveTask(taskListId, task) {
      var deferred = $q.defer();

      $http.post(REST_BASE_PATH + '/task', {
        taskListId: taskListId,
        task: task
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
     * Remove the given task from its task list.
     * 
     * @memberOf TaskListService#
     * @param {string} taskListId - The ID of task list
     * @param {string} taskId - The uuid of the task to be removed
     * @returns A promise resolving to the HTTP response data
     */
    function removeTask(taskListId, taskId) {
      var deferred = $q.defer();

      $http({
        url: REST_BASE_PATH + '/task',
        method: 'DELETE',
        params: {
          tl: taskListId,
          t: taskId
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
     * @memberOf TaskListService#
     * @param {Object} taskList - The taskList to be exported
     */
    function exportTasks(taskList) {
      $window.open(REST_BASE_PATH + '/export?tl=' + taskList._id + '&t=' + AuthService.getToken(true));
    }

    /**
     * Add the current user as a watcher to the given task list.
     * 
     * @memberOf TaskListService#
     * @param {Object} taskList - The task list to add a watcher to
     * @returns A promise resolving to the HTTP response data
     */
    function addWatcher(taskList) {
      var deferred = $q.defer();

      $http.post(REST_BASE_PATH + '/watcher', {
        taskListId: taskList._id
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    }

    /**
     * Stop watching the given task list.
     * 
     * @memberOf TaskListService#
     * @param {Object} taskList - The task list to stop watching
     * @returns A promise resolving to the HTTP response data
     */
    function removeWatcher(taskList) {
      var deferred = $q.defer();

      $http({
        url: REST_BASE_PATH + '/watcher',
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
