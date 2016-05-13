/* global angular */
/*
 * login-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for logging in a user.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("LoginController", LoginController);

  LoginController.$inject = [ '$scope', 'AuthService' ];

  /**
   * The main controller of the login view.
   * 
   * @class
   * @name LoginController
   * @param {Object} $scope - The scope of this controller
   * @param {Object} AuthService - The authentication service
   */
  function LoginController($scope, AuthService) {

    /**
     * The view model of this controller
     * 
     * @fieldOf ContentController
     * @type Object
     */
    var vm = this;

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    vm.login = login;

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Login function that is called when the user clicks the 'Login' button.
     * 
     * @memberOf LoginController
     */
    function login(username, password) {
      AuthService.login(username, password);
    }
  }

})();