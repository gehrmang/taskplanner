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
     * The view model of this controller
     * 
     * @fieldOf ContentController
     * @type Object
     */
    var vm = this;

    /**
     * The currently selected task list.
     * 
     * @fieldOf ContentController
     * @type Object
     */
    vm.taskList = undefined;

    /**
     * Reference to the task list that is currently renamed.
     * 
     * @fieldOf ContentController
     * @type Object
     */
    vm.renamingTaskList = undefined;

    /**
     * All available task lists of the current user.
     * 
     * @fieldOf ContentController
     * @type Object[]
     */
    vm.myTaskLists = [];

    /**
     * All selected shared task lists.
     * 
     * @fieldOf ContentController
     * @type Object[]
     */
    vm.sharedTaskLists = [];

    /**
     * The currently shown messages.
     * 
     * @fieldOf ContentController
     * @type Object[]
     */
    vm.messages = [];

    /**
     * Flag indicating if the task list edit mode is currently enabled.
     * 
     * @fieldOf ContentController
     * @type boolean
     */
    vm.editMode = false;

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    vm.selectTaskList = selectTaskList;
    vm.addTaskList = addTaskList;
    vm.editTaskList = editTaskList;
    vm.renameTaskList = renameTaskList;
    vm.saveRename = saveRename;
    vm.cancelRename = cancelRename;
    vm.removeTaskList = removeTaskList;
    vm.addTask = addTask;
    vm.editTask = editTask;
    vm.cancelEdit = cancelEdit;
    vm.saveTask = saveTask;
    vm.removeTask = removeTask;

    /** ************************************ */
    /** ************* Hotkeys ************** */
    /** ************************************ */

    hotkeys.bindTo($scope).add({
      combo: 'esc',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: cancelRename
    }).add({
      combo: 'return',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: saveRename
    });

    /** ************************************ */
    /** ******* Data initialisation ******** */
    /** ************************************ */
    activate();

    /**
     * Initialize the required data.
     * 
     * @memberOf ContentController#
     */
    function activate() {
      return TaskListService.list().then(function(result) {
        vm.myTaskLists = result;
      });
    }

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Select the given task list.
     * 
     * @memberOf ContentController#
     * @param {Object} taskList - The taskList to be selected
     */
    function selectTaskList(taskList) {
      if (vm.renamingTaskList && ((!vm.renamingTaskList._id && !taskList._id) || vm.renamingTaskList._id === taskList._id)) {
        return;
      }

      vm.taskList = taskList;
      if (vm.renamingTaskList) {
        vm.saveRename();
      }
    }

    /**
     * Add a new task list and set it as the currently selected list.
     * 
     * @memberOf ContentController#
     */
    function addTaskList() {
      var newTaskList = {
        title: $translate.instant('CONTENT.TASK_LIST_DEFAULT_TITLE'),
        tasks: [],
        shared: false
      };

      vm.taskList = newTaskList;
      vm.myTaskLists.push(newTaskList);

      if (vm.renamingTaskList) {
        vm.saveRename();
      }

      vm.renameTaskList(newTaskList);
    }

    /**
     * Enable the edit mode for the currently selected task list.
     * 
     * @memberOf ContentController#
     */
    function editTaskList() {
      if (vm.taskList) {
        vm.editMode = true;
      }
    }

    /**
     * Enable rename mode for the given task list.
     * 
     * @memberOf ContentController#
     * @param {Object} taskList - The task list to be renamed
     */
    function renameTaskList(taskList) {
      vm.renamingTaskList = taskList;
      taskList.rename = true;
      taskList.oriTitle = taskList.title;

      setTimeout(function() {
        var inputFields = document.getElementsByClassName('task-list-title-input');
        if (inputFields.length > 0) {
          inputFields[0].focus();
        }
      }, 10);
    }

    /**
     * Save the new title of the given task list.
     * 
     * @memberOf ContentController#
     */
    function saveRename() {
      if (!vm.renamingTaskList) {
        return;
      }
      
      vm.renamingTaskList.rename = false;
      delete vm.renamingTaskList.oriTitle;
      TaskListService.save(vm.renamingTaskList).then(function(result) {
        vm.renamingTaskList._id = result._id;
        vm.renamingTaskList = undefined;
      });
    }

    /**
     * Cancel renaming and restore the original title.
     * 
     * @memberOf ContentController#
     */
    function cancelRename() {
      if (!vm.renamingTaskList) {
        return;
      }
      
      vm.renamingTaskList.rename = false;
      vm.renamingTaskList.title = vm.renamingTaskList.oriTitle;
      delete vm.renamingTaskList.oriTitle;
      vm.renamingTaskList = undefined;
    }

    /**
     * Remove the given task list.
     * 
     * @memberOf ContentController#
     * @param {Object} taskList - The task list to be removed
     */
    function removeTaskList(taskList) {
      if (vm.taskList && vm.taskList._id === taskList._id) {
        vm.taskList = undefined;
      }

      var index = vm.myTaskLists.map(function(tl) {
        return tl._id;
      }).indexOf(taskList._id);

      if (index >= 0) {
        vm.myTaskLists.splice(index, 1);
        TaskListService.remove(taskList);
      }
    }

    /**
     * Add a new task to the currently selected task list.
     * 
     * @memberOf ContentController#
     */
    function addTask() {
      if (!vm.taskList) {
        return;
      }

      vm.taskList.tasks.push({
        uuid: uuid4.generate(),
        title: '',
        dueDate: undefined,
        done: false,
        editMode: true,
        isNew: true
      });
    }

    /**
     * Enable the edit mode of the given task and backup its current title and due-date.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to be edited
     */
    function editTask(task) {
      task.backupTitle = task.title;
      task.backupDueDate = task.dueDate;
      task.editMode = true;
    }

    /**
     * Cancel the edit mode of the given task and restore its original title and due-date.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to cancel the edit mode of
     */
    function cancelEdit(task) {
      if (task.isNew) {
        var index = vm.taskList.tasks.map(function(t) {
          return t.uuid;
        }).indexOf(task.uuid);

        if (index >= 0) {
          vm.taskList.tasks.splice(index, 1);
        }

        return;
      }

      task.title = task.backupTitle;
      task.dueDate = task.backupDueDate;
      task.editMode = false;

      delete task.backupTitle;
      delete task.backupDueDate;
    }

    /**
     * Save the given task.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to be saved
     */
    function saveTask(task) {
      task.editMode = false;
      delete task.backupTitle;
      delete task.backupDueDate;

      TaskListService.saveTasks(vm.taskList).then(function() {
        delete task.isNew;
      });
    }

    /**
     * Remove the given task from the task list.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to be removed
     */
    function removeTask(task) {
      var index = vm.taskList.tasks.map(function(t) {
        return t.uuid;
      }).indexOf(task.uuid);

      if (index >= 0) {
        vm.taskList.tasks.splice(index, 1);
        TaskListService.saveTasks(vm.taskList);
      }
    }
  }

})();