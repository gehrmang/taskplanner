/* global angular */
/*
 * header-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the users view.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("UserController", UserController);

  UserController.$inject = ['$rootScope', '$scope', 'UserService'];

  /**
   * The main controller for the global page header.
   * 
   * @class
   * @name UserController
   * @param {Object} $rootScope - The global root scope
   * @param {Object} $scope - The scope of this controller
   * @param {Object} UserService - The user service
   */
  function UserController($rootScope, $scope, UserService) {

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
      return UserService.list().then(function(result) {
        vm.users = result;
      });
    }

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

  }

})();