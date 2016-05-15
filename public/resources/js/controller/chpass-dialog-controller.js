/* global angular */
/*
 * chpass-dialog-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the change password dialog.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("ChangePasswordDialogController", ChangePasswordDialogController);

  ChangePasswordDialogController.$inject = ['$mdDialog'];

  /**
   * The main controller of change password dialog.
   * 
   * @class
   * @name ChangePasswordDialogController
   * @param {Object} $mdDialog - The Angular Material dialog service
   */
  function ChangePasswordDialogController($mdDialog) {
    /**
     * The view model of this controller
     * 
     * @fieldOf ChangePasswordDialogController
     * @type Object
     */
    var cdc = this;
    
    /**
     * The old password.
     * 
     * @fieldOf ChangePasswordDialogController
     * @type string
     */
    cdc.oldPassword;
    
    /**
     * The new password.
     * 
     * @fieldOf ChangePasswordDialogController
     * @type string
     */
    cdc.newPassword;
    
    /**
     * The repeated new password.
     * 
     * @fieldOf ChangePasswordDialogController
     * @type string
     */
    cdc.newPassword2;

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    cdc.cancel = cancel;
    cdc.save = save;

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Cancel the change password dialog.
     * 
     * @memberOf ChangePasswordDialogController#
     */
    function cancel() {
      $mdDialog.cancel();
    }

    /**
     * Close the change password dialog and save the new password.
     * 
     * @memberOf ChangePasswordDialogController.
     */
    function save() {
      $mdDialog.hide(cdc.newPassword);
    }
  }
})();