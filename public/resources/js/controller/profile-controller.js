/* global angular */
/*
 * profile-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the profile view.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("ProfileController", ProfileController);

  ProfileController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$translate', 'GravatarService', 'AuthService', 'UserService'];

  /**
   * The main controller for the profile view.
   * 
   * @class
   * @name ProfileController
   * @param {Object} $scope - The scope of this controller
   * @param {Object} $mdDialog - The Angular Material dialog service
   * @param {Object} $mdMedia - The Angular Material media service
   * @param {Object} $translate - The translation service
   * @param {Object} GravatarService - The md5 hashing service
   * @param {Object} AuthService - The authentication service
   * @param {Object} UserService - The user service
   */
  function ProfileController($scope, $mdDialog, $mdMedia, $translate, GravatarService, AuthService, UserService) {


    /**
     * The view model of this controller
     * 
     * @fieldOf ProfileController
     * @type Object
     */
    var vm = this;

    /**
     * The currently logged in user.
     * 
     * @fieldOf ProfileController
     * @type Object
     */
    vm.currentUser = AuthService.getUser();

    /**
     * A copy of the current user which can be modified by the user.
     * 
     * @fieldOf ProfileController
     * @type Object
     */
    vm.editUser = angular.copy(vm.currentUser);

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    vm.getGravatarUrl = getGravatarUrl;
    vm.saveUser = saveUser;
    vm.reset = reset;
    vm.openPasswordDialog = openPasswordDialog;

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Generate the user based Gravatar URL.
     * 
     * @memberOf ProfileController#
     * @returns The generated Gravatar URL
     */
    function getGravatarUrl() {
      return GravatarService.getUrl(150);
    }

    /**
     * Save the user input.
     * 
     * @memberOf ProfileController#
     */
    function saveUser() {
      UserService.saveUser(vm.editUser).then(function(result) {
        vm.currentUser = angular.copy(vm.editUser);
        AuthService.getUser().firstname = vm.currentUser.firstname;
        AuthService.getUser().name = vm.currentUser.name;
        AuthService.getUser().email = vm.currentUser.email;
        AuthService.getUser().language = vm.currentUser.language;
        $translate.use(vm.currentUser.language);
      });
    }

    /**
     * Reset the current user to its original state.
     * 
     * @memberOf ProfileController#
     */
    function reset() {
      vm.editUser = angular.copy(vm.currentUser);
    }

    /**
     * Open the change password dialog.
     * 
     * @memberOf ProfileController#
     */
    function openPasswordDialog() {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
          controller: 'ChangePasswordDialogController',
          controllerAs: 'cdc',
          templateUrl: '/partials/dialogs/chpass-dialog.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen,
          bindToController: true
        })
        .then(function(oldPassword, newPassword) {
          UserService.changePassword(vm.currentUser, oldPassword, newPassword);
        });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }
  }

})();