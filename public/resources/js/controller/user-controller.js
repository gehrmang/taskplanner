/* global angular */
/*
 * user-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the user list view.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("UserController", UserController);

  UserController.$inject = ['$rootScope', '$scope', '$mdDialog', '$mdMedia', '$translate',
    'UserService', 'GrowlService'
  ];

  /**
   * The main controller for the global page header.
   * 
   * @class
   * @name UserController
   * @param {Object} $rootScope - The global root scope
   * @param {Object} $scope - The scope of this controller
   * @param {Object} $mdDialog - The Angular Material dialog service
   * @param {Object} $mdMedia - The Angular Material media service
   * @param {Object} $translate - The translation service
   * @param {Object} UserService - The user service
   * @param {Object} GrowlService - The growl notification service
   */
  function UserController($rootScope, $scope, $mdDialog, $mdMedia, $translate, UserService, GrowlService) {

    /**
     * The view model of this controller
     * 
     * @fieldOf UserController
     * @type Object
     */
    var vm = this;

    /**
     * An Array of all available users.
     * 
     * @fieldOf UserController
     * @type Object[]
     */
    vm.users = [];

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    vm.removeUser = removeUser;
    vm.confirm = confirm;

    /** ************************************ */
    /** ******* Data initialisation ******** */
    /** ************************************ */
    activate();

    /**
     * Initialize the required data.
     * 
     * @memberOf ContentController#
     * @private
     */
    function activate() {
      return UserService.list().then(function(result) {
        vm.users = result;
      });
    }

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Remove the given user.
     * 
     * @memberOf ContentController#
     * @param {Object} user - The user to be removed
     */
    function removeUser(user) {
      var index = vm.users.map(function(u) {
        return u._id;
      }).indexOf(user._id);
      
      vm.users.splice(index, 1);
      UserService.removeUser(user).then(function() {
        GrowlService.success($translate.instant('USERS.REMOVE_SUCCESS'));
      });
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

  }

})();