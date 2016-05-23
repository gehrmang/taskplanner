/* global angular */
/*
 * add-shared-dialog-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the add shared task list view.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("AddSharedListController", AddSharedListController);

  AddSharedListController.$inject = ['$scope', 'TaskListService'];

  /**
   * The main controller of the add shared task list view.
   * 
   * @class
   * @name AddSharedListController
   * @param {Object} $scope - The current scope
   * @param {Object} TaskListService - The task list service
   */
  function AddSharedListController($scope, TaskListService) {
    /**
     * The view model of this controller
     * 
     * @fieldOf AddSharedListController
     * @type Object
     */
    var vm = this;

    /**
     * All available shared task lists.
     * 
     * @fieldOf AddSharedListController
     * @type Object[]
     */
    vm.sharedTaskLists = [];

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    vm.addSharedTaskList = addSharedTaskList;

    /** ************************************ */
    /** ******* Data initialisation ******** */
    /** ************************************ */
    activate();

    /**
     * Initialize the required data.
     * 
     * @memberOf AddSharedListController#
     */
    function activate() {
      return TaskListService.listShared().then(function(result) {
        vm.sharedTaskLists = result;
      });
    }

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Add a shared task list.
     * 
     * @memberOf AddSharedListController#
     * @param {Object} taskList - The task list to be added
     */
    function addSharedTaskList(taskList) {
      TaskListService.addWatcher(taskList);
      $scope.sharedTaskLists.push(taskList);

      var index = vm.sharedTaskLists.map(function(tl) {
        return tl._id;
      }).indexOf(taskList._id);
      if (index >= 0) {
        vm.sharedTaskLists.splice(index, 1);
      }
    }

  }
})();