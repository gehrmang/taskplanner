/* global angular moment */
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

  ContentController.$inject = ['$rootScope', '$scope', '$state', '$mdDialog', '$mdMedia', '$translate', 'hotkeys', 'uuid4', 'AuthService', 'TaskListService', 'GrowlService', 'Socket'];

  /**
   * The main controller of the content view.
   * 
   * @class
   * @name ContentController
   * @param {Object} $rootScope - The global root scope
   * @param {Object} $scope - The scope of this controller
   * @param {Object} $state - The $state service
   * @param {Object} $mdDialog - The Angular Material dialog service
   * @param {Object} $mdMedia - The Angular Material media service
   * @param {Object} $translate - The $translation service
   * @param {Object} hotkeys - The hotkeys service
   * @param {Object} uuid4 - The uuid4 service
   * @param {Object} AuthService - The authentication service
   * @param {Object} TaskListService - The task list service
   * @param {Object} GrowlService - The growl notification service
   * @param {Object} Socket - The Socket.IO wrapper service
   */
  function ContentController($rootScope, $scope, $state, $mdDialog, $mdMedia, $translate, hotkeys, uuid4, AuthService, TaskListService, GrowlService, Socket) {

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
     * All selected shared task lists. Use $scope instead of vm to make it visible for child scopes.
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
    vm.addSharedTaskList = addSharedTaskList;
    vm.editTaskList = editTaskList;
    vm.renameTaskList = renameTaskList;
    vm.saveTaskList = saveTaskList;
    vm.cancelRename = cancelRename;
    vm.removeTaskList = removeTaskList;
    vm.removeWatcher = removeWatcher;
    vm.shareTaskList = shareTaskList;
    vm.exportTaskList = exportTaskList;
    vm.addTask = addTask;
    vm.editTask = editTask;
    vm.cancelEdit = cancelEdit;
    vm.saveTask = saveTask;
    vm.removeTask = removeTask;
    vm.checkDueDate = checkDueDate;
    vm.confirm = confirm;
    vm.isOwner = isOwner;

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
      callback: saveTaskList
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
        vm.myTaskLists = result.filter(function(tl) {
          return tl.owner === AuthService.getUser()._id;
        });

        $scope.sharedTaskLists = result.filter(function(tl) {
          return tl.owner != AuthService.getUser()._id;
        });
      });
    }

    /** ************************************ */
    /** ********* Socket listener ********** */
    /** ************************************ */

    Socket.on('init', function(data) {});

    /**
     * Socket listener for updated task lists.
     * 
     * @memberOf ContentController#
     * @private
     */
    Socket.on('tasklist updated', function(data) {
      var taskList = $scope.sharedTaskLists.filter(function(tl) {
        return tl._id === data.taskList._id;
      });

      if (taskList.length === 0) {
        taskList = vm.myTaskLists.filter(function(tl) {
          return tl._id === data.taskList._id;
        });
      }

      if (taskList.length > 0) {
        taskList[0].title = data.taskList.title;
      }
    });
    /**
     * Socket listener for added tasks.
     * 
     * @memberOf ContentController#
     * @private
     */
    Socket.on('task added', function(data) {
      var taskList = $scope.sharedTaskLists.filter(function(tl) {
        return tl._id === data.taskListId;
      });

      if (taskList.length === 0) {
        taskList = vm.myTaskLists.filter(function(tl) {
          return tl._id === data.taskListId;
        });
      }

      if (taskList.length > 0) {
        var taskIndex = taskList[0].tasks.map(function(t) {
          return t.uuid;
        }).indexOf(data.task.uuid);

        if (taskIndex >= 0) {
          taskList[0].tasks[taskIndex] = data.task;
        } else {
          taskList[0].tasks.push(data.task);
        }
      }
    });

    /**
     * Socket listener for updated tasks.
     * 
     * @memberOf ContentController#
     * @private
     */
    Socket.on('task updated', function(data) {
      var taskList = $scope.sharedTaskLists.filter(function(tl) {
        return tl._id === data.taskListId;
      });

      if (taskList.length === 0) {
        taskList = vm.myTaskLists.filter(function(tl) {
          return tl._id === data.taskListId;
        });
      }

      if (taskList.length > 0) {
        var taskIndex = taskList[0].tasks.map(function(t) {
          return t.uuid;
        }).indexOf(data.task.uuid);

        if (taskIndex >= 0) {
          taskList[0].tasks[taskIndex] = data.task;
        }
      }
    });

    /**
     * Socket listener for removed tasks.
     * 
     * @memberOf ContentController#
     * @private
     */
    Socket.on('task removed', function(data) {
      var taskList = $scope.sharedTaskLists.filter(function(tl) {
        return tl._id === data.taskListId;
      });

      if (taskList.length === 0) {
        taskList = vm.myTaskLists.filter(function(tl) {
          return tl._id === data.taskListId;
        });
      }

      if (taskList.length > 0) {
        var taskIndex = taskList[0].tasks.map(function(t) {
          return t.uuid;
        }).indexOf(data.taskId);

        if (taskIndex >= 0) {
          taskList[0].tasks.splice(taskIndex, 1);
        }
      }
    });

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

      // Navigate to home state to show the selected task list
      if (!$state.is('home')) {
        $state.go('home');
      }

      vm.taskList = taskList;
      if (vm.renamingTaskList) {
        vm.saveTaskList();
      }
    }

    /**
     * Add a new task list and set it as the currently selected list.
     * 
     * @memberOf ContentController#
     */
    function addTaskList() {
      // Navigate to home state to show the selected task list
      if (!$state.is('home')) {
        $state.go('home');
      }

      var newTaskList = {
        title: $translate.instant('CONTENT.TASK_LIST_DEFAULT_TITLE'),
        tasks: [],
        shared: false
      };

      vm.taskList = newTaskList;
      vm.myTaskLists.push(newTaskList);

      if (vm.renamingTaskList) {
        vm.saveTaskList();
      }

      vm.renameTaskList(newTaskList);
    }

    /**
     * Open the dialog to add a shared task list.
     * 
     * @memberOf ContentController#
     */
    function addSharedTaskList() {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
          controller: 'AddSharedDialogController',
          controllerAs: 'sdc',
          templateUrl: '/partials/dialogs/add-shared-dialog.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen,
          bindToController: true,
          locals: {
            taskList: vm.taskList
          }
        })
        .then(function() {
          TaskListService.save(vm.taskList).then(function() {
              GrowlService.success($translate.instant('CONTENT.SAVE_SUCCESS'));
            },
            function() {
              GrowlService.error($translate.instant('CONTENT.SAVE_ERROR'));
            });
        }, function() {});

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
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
    function saveTaskList() {
      if (!vm.renamingTaskList) {
        return;
      }

      vm.renamingTaskList.rename = false;
      delete vm.renamingTaskList.oriTitle;
      TaskListService.save(vm.renamingTaskList).then(function(result) {
          if (!vm.renamingTaskList._id && result._id) {
            vm.renamingTaskList._id = result._id;
          }
          vm.renamingTaskList = undefined;
          GrowlService.success($translate.instant('CONTENT.SAVE_SUCCESS'));
        },
        function() {
          GrowlService.error($translate.instant('CONTENT.SAVE_ERROR'));
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

      if (!vm.renamingTaskList._id) {
        var index = -1;
        for (var i = 0; i < vm.myTaskLists.length; i++) {
          if (!vm.myTaskLists[i]._id) {
            index = i;
            break;
          }
        }

        if (index >= 0) {
          vm.myTaskLists.splice(index, 1);
        }

        vm.renamingTaskList = undefined;
        vm.taskList = undefined;
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
        TaskListService.remove(taskList).then(function() {
            GrowlService.success($translate.instant('CONTENT.REMOVE_SUCCESS'));
          },
          function() {
            GrowlService.error($translate.instant('CONTENT.REMOVE_ERROR'));
          });
      }
    }

    /**
     * Stop watching the given task list.
     * 
     * @memberOf ContentController#
     * @param {Object} taskList - The task list to stop watching
     */
    function removeWatcher(taskList) {
      TaskListService.removeWatcher(taskList).then(function() {
        var index = $scope.sharedTaskLists.map(function(tl) {
          return tl._id;
        }).indexOf(taskList._id);

        if (index >= 0) {
          $scope.sharedTaskLists.splice(index, 1);
          if (vm.taskList._id === taskList._id) {
            vm.taskList = undefined;
          }
        }
      });
    }

    /**
     * Open the share dialog for the current task list.
     * 
     * @memberOf ContentController#
     * @param {Object} event - The target event
     */
    function shareTaskList(event) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
          controller: 'ShareDialogController',
          controllerAs: 'sdc',
          templateUrl: '/partials/dialogs/share-dialog.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen,
          bindToController: true,
          locals: {
            taskList: vm.taskList
          }
        })
        .then(function() {
          TaskListService.save(vm.taskList).then(function() {
              GrowlService.success($translate.instant('CONTENT.SAVE_SUCCESS'));
            },
            function() {
              GrowlService.error($translate.instant('CONTENT.SAVE_ERROR'));
            });
        }, function() {});

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    /**
     * Export the current task list.
     * 
     * @memberOf ContentController#
     */
    function exportTaskList() {
      TaskListService.exportTasks(vm.taskList);
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

      if (task.dueDate) {
        task.dueDate = new Date(task.dueDate);
      }
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

      TaskListService.saveTask(vm.taskList._id, task).then(function() {
          delete task.isNew;
          GrowlService.success($translate.instant('CONTENT.TASK.SAVE_SUCCESS'));
        },
        function() {
          GrowlService.error($translate.instant('CONTENT.TASK.SAVE_ERROR'));
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
        TaskListService.removeTask(vm.taskList._id, task.uuid).then(function() {
            GrowlService.success($translate.instant('CONTENT.TASK.REMOVE_SUCCESS'));
          },
          function() {
            GrowlService.error($translate.instant('CONTENT.TASK.REMOVE_ERROR'));
          });
      }
    }

    /**
     * Check if the given task is overdue.
     * 
     * @memberOf ContentController#
     * @param {Object} task - The task to be checked
     */
    function checkDueDate(task) {
      if (!task || !task.dueDate || task.done) {
        return false;
      }

      var dueDate = moment(task.dueDate);
      var today = moment().startOf('day');
      if (dueDate.isSame(today)) {
        return 'dueToday';
      }

      if (dueDate.isBefore(today)) {
        return 'overdue';
      }
    }

    /**
     * Show a confirm dialog with the given message.
     * 
     * @memberOf ContentController#
     * @param {Object} event - The target event
     * @param {string} messageKey - The confirmation message key
     * @param {Object} targetObject - The object this confirmation is about. Will be handed over to onConfirm.
     * @callback onConfirm
     */
    function confirm(event, messageKey, targetObject, onConfirm) {
      var confirm = $mdDialog.confirm()
        .textContent($translate.instant(messageKey))
        .targetEvent(event)
        .ok($translate.instant('GLOBAL.OK'))
        .cancel($translate.instant('GLOBAL.CANCEL'));

      $mdDialog.show(confirm).then(function() {
        onConfirm(targetObject);
      }, function() {});
    }

    /**
     * Check if the current user is the owner of the currently selected task list.
     * 
     * @memberOf ContentController#
     * @returns {boolean} true if the current user is the owner, false otherwise
     */
    function isOwner() {
      return vm.taskList.owner === AuthService.getUser()._id;
    }
  }
})();