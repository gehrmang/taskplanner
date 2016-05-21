/* global angular */
/*
 * user-edit-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the user edit view.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("UserEditController", UserEditController);

  UserEditController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$translate', 'UserService', 'GrowlService'];

  /**
   * The main controller for the global page header.
   * 
   * @class
   * @name UserEditController
   * @param {Object} $rootScope - The global root scope
   * @param {Object} $scope - The scope of this controller
   * @param {Object} $state - The $state service
   * @param {Object} $stateParams - The state parameters
   * @param {Object} $translate - The translation service
   * @param {Object} UserService - The user service
   * @param {Object} GrowlService - The growl notification service
   */
  function UserEditController($rootScope, $scope, $state, $stateParams, $translate, UserService, GrowlService) {

    /**
     * The view model of this controller
     * 
     * @fieldOf UserEditController
     * @type Object
     */
    var vm = this;

    /**
     * The currently selected user.
     * 
     * @fieldOf UserEditController
     * @type Object
     */
    vm.user = undefined;

    /**
     * A copy of the selected user which will be modified.
     * 
     * @fieldOf UserEditController
     * @type Object
     */
    vm.editUser = undefined;

    /**
     * Flag indicating if the selected user is a new user.
     * 
     * @fieldOf UserEditController
     * @type boolean
     */
    vm.isNewUser = true;

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    
    vm.saveUser = saveUser;
    vm.reset = reset;

    /** ************************************ */
    /** ******* Data initialisation ******** */
    /** ************************************ */
    activate();

    /**
     * Initialize the required data.
     * 
     * @memberOf UserEditController#
     * @private
     */
    function activate() {
      if ($stateParams.username) {
        UserService.getUser($stateParams.username).then(function(user) {
          vm.user = user;
          vm.editUser = angular.copy(vm.user);
          vm.isNewUser = false;
        });
      } else {
        vm.user = {};
        vm.editUser = {};
        vm.isNewUser = true;
      }
    }

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Save the user input.
     * 
     * @memberOf UserEditController#
     */
    function saveUser() {
      UserService.saveUser(vm.editUser).then(function(result) {
        vm.user = angular.copy(vm.editUser);
        $state.go('users.list');
        GrowlService.success($translate.instant('USERS.SAVE_SUCCESS'));
      });
    }

    /**
     * Reset the current user to its original state.
     * 
     * @memberOf UserEditController#
     */
    function reset() {
      vm.editUser = angular.copy(vm.user);
    }
  }

})();