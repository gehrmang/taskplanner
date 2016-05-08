/* global angular */
/*
 * content-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the main content view.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */

  angular.module("taskplanner").controller("ContentController", ContentController);

  ContentController.$inject = ['$rootScope', '$scope', '$translate', 'hotkeys', 'uuid4', 'AuthService', 'TaskListService'];

  /**
   * The main controller of the content view.
   * 
   * @class
   * @name ContentController
   * @param {Object} $rootScope - The global root scope
   * @param {Object} $scope - The scope of this controller
   * @param {Object} $translate - The $translation service
   * @param {Object} hotkeys - The hotkeys service
   * @param {Object} uuid4 - The uuid4 service
   * @param {Object} AuthService - The authentication service
   * @param {Object} TaskListService - The task list service
   */
  function ContentController($rootScope, $scope, $translate, hotkeys, uuid4, AuthService, TaskListService) {

    /**
     * The currently selected task list.
     * 
     * @fieldOf ContentController
     * @type Object
     */
    $scope.taskList = undefined;

    /**
     * Reference to the task list that is currently renamed.
     * 
     * @fieldOf ContentController
     * @type Object
     */
    $scope.renamingTaskList = undefined;

    /**
     * All available task lists of the current user.
     * 
     * @fieldOf ContentController
     * @type Object[]
     */
    $scope.myTaskLists = [];

    /**
     * All selected shared task lists.
     * 
     * @fieldOf ContentController
     * @type Object[]
     */
    $scope.sharedTaskLists = [];

    /**
     * The currently shown messages.
     * 
     * @fieldOf ContentController
     * @type Object[]
     */
    $scope.messages = [];

    /**
     * Flag indicating if the task list edit mode is currently enabled.
     * 
     * @fieldOf ContentController
     * @type boolean
     */
    $scope.editMode = false;


    /** ************************************ */
    /** ************* Hotkeys ************** */
    /** ************************************ */

    hotkeys.bindTo($rootScope).add({
      combo: 'esc',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        if ($scope.renamingTaskList) {
          $scope.cancelRename();
        }
      }
    }).add({
      combo: 'return',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        if ($scope.renamingTaskList) {
          $scope.saveRename();
        }
      }
    });

    /** ************************************ */
    /** ******* Data initialisation ******** */
    /** ************************************ */
    TaskListService.list().then(function(result) {
      $scope.myTaskLists = result;
    });

    /** ************************************ */
    /** ******* Controller functions ******* */
    /** ************************************ */

    /**
     * Select the given task list.
     * 
     * @memberOf ContentController#
     * @param {Object} taskList - The taskList to be selected
     */
    $scope.selectTaskList = function(taskList) {
      if ($scope.renamingTaskList && ((!$scope.renamingTaskList._id && !taskList._id) || $scope.renamingTaskList._id === taskList._id)) {
        return;
      }

      $scope.taskList = taskList;
      if ($scope.renamingTaskList) {
        $scope.saveRename();
      }
    };

    /**
     * Add a new task list and set it as the currently selected list.
     * 
     * @memberOf ContentController#
     */
    $scope.addTaskList = function() {
      var newTaskList = {
        title: $translate.instant('CONTENT.TASK_LIST_DEFAULT_TITLE'),
        tasks: [],
        shared: false
      };

      $scope.taskList = newTaskList;
      $scope.myTaskLists.push(newTaskList);

      if ($scope.renamingTaskList) {
        $scope.saveRename();
      }

      $scope.renameTaskList(newTaskList);
    };

    /**
     * Enable the edit mode for the currently selected task list.
     * 
     * @memberOf ContentController#
     */
    $scope.editTaskList = function() {
      if ($scope.taskList) {
        $scope.editMode = true;
      }
    };

    /**
     * Enable rename mode for the given task list.
     * 
     * @memberOf ContentController#
     * @param {Object} taskList - The task list to be renamed
     */
    $scope.renameTaskList = function(taskList) {
      $scope.renamingTaskList = taskList;
      taskList.rename = true;
      taskList.oriTitle = taskList.title;

      setTimeout(function() {
        var inputFields = document.getElementsByClassName('task-list-title-input');
        if (inputFields.length > 0) {
          inputFields[0].focus();
        }
      }, 10);
    };

    /**
     * Save the new title of the given task list.
     * 
     * @memberOf ContentController#
     */
    $scope.saveRename = function() {
      $scope.renamingTaskList.rename = false;
      delete $scope.renamingTaskList.oriTitle;
      TaskListService.save($scope.renamingTaskList).then(function(result) {
        $scope.renamingTaskList._id = result._id;
        $scope.renamingTaskList = undefined;
      });
    };

    /**
     * Cancel renaming and restore the original title.
     * 
     * @memberOf ContentController#
     */
    $scope.cancelRename = function() {
      $scope.renamingTaskList.rename = false;
      $scope.renamingTaskList.title = $scope.renamingTaskList.oriTitle;
      delete $scope.renamingTaskList.oriTitle;
      $scope.renamingTaskList = undefined;
    };

    /**
     * Remove the given task list.
     * 
     * @memberOf ContentController#
     * @param {Object} taskList - The task list to be removed
     */
    $scope.removeTaskList = function(taskList) {
      if ($scope.taskList && $scope.taskList._id === taskList._id) {
        $scope.taskList = undefined;
      }

      var index = $scope.myTaskLists.map(function(tl) {
        return tl._id;
      }).indexOf(taskList._id);

      if (index >= 0) {
        $scope.myTaskLists.splice(index, 1);
        TaskListService.remove(taskList);
      }
    };

    /**
     * Add a new task to the currently selected task list.
     * 
     * @memberOf ContentController#
     */
    $scope.addTask = function() {
      if (!$scope.taskList) {
        return;
      }

      $scope.taskList.tasks.push({
        uuid: uuid4.generate(),
        title: '',
        dueDate: undefined,
        done: false,
        editMode: true,
        isNew: true
      });
    };

    /**
     * Enable the edit mode of the given task and backup its current title and due-date.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to be edited
     */
    $scope.editTask = function(task) {
      task.backupTitle = task.title;
      task.backupDueDate = task.dueDate;
      task.editMode = true;
    };

    /**
     * Cancel the edit mode of the given task and restore its original title and due-date.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to cancel the edit mode of
     */
    $scope.cancelEdit = function(task) {
      if (task.isNew) {
        var index = $scope.taskList.tasks.map(function(t) {
          return t.uuid;
        }).indexOf(task.uuid);

        if (index >= 0) {
          $scope.taskList.tasks.splice(index, 1);
        }

        return;
      }

      task.title = task.backupTitle;
      task.dueDate = task.backupDueDate;
      task.editMode = false;

      delete task.backupTitle;
      delete task.backupDueDate;
    };

    /**
     * Save the given task.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to be saved
     */
    $scope.saveTask = function(task) {
      task.editMode = false;
      delete task.backupTitle;
      delete task.backupDueDate;

      TaskListService.saveTasks($scope.taskList).then(function() {
        delete task.isNew;
      });
    };

    /**
     * Remove the given task from the task list.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to be removed
     */
    $scope.removeTask = function(task) {
      var index = $scope.taskList.tasks.map(function(t) {
        return t.uuid;
      }).indexOf(task.uuid);

      if (index >= 0) {
        $scope.taskList.tasks.splice(index, 1);
        TaskListService.saveTasks($scope.taskList);
      }
    };
  }

})();