/* global angular */
/*
 * header-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the global page header.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("HeaderController", HeaderController);

  HeaderController.$inject = ['$rootScope', '$scope', '$state', 'GravatarService', 'AuthService'];

  /**
   * The main controller for the global page header.
   * 
   * @class
   * @name HeaderController
   * @param {Object} $rootScope - The global root scope
   * @param {Object} $scope - The scope of this controller
   * @param {Object} $state - The current ui-router state
   * @param {Object} GravatarService - The Gravatar service
   * @param {Object} AuthService - The authentication service
   */
  function HeaderController($rootScope, $scope, $state, GravatarService, AuthService) {

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
    vm.logout = logout;
    vm.getGravatarUrl = getGravatarUrl;

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Logout the current user.
     * 
     * @memberOf HeaderController#
     */
    function logout() {
      AuthService.logout();
    }

    /**
     * Generate the user based Gravatar URL.
     * 
     * @memberOf HeaderController#
     * @returns The generated Gravatar URL
     */
    function getGravatarUrl() {
      return GravatarService.getUrl(30);
    }

  }

})();