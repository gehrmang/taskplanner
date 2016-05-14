/* global angular */
/*
 * share-dialog-controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Controller for the share task list dialog.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").controller("ShareDialogController", ShareDialogController);

  ShareDialogController.$inject = ['$mdDialog'];

  /**
   * The main controller of the content view.
   * 
   * @class
   * @name ShareDialogController
   * @param {Object} $mdDialog - The Angular Material dialog service
   */
  function ShareDialogController($mdDialog) {
    /**
     * The view model of this controller
     * 
     * @fieldOf ShareDialogController
     * @type Object
     */
    var sdc = this;

    /** ************************************ */
    /** ******* Function definitions ******* */
    /** ************************************ */
    sdc.cancel = cancel;
    sdc.save = save;

    /** ************************************ */
    /** ***** Controller implementation **** */
    /** ************************************ */

    /**
     * Cancel the share dialog.
     * 
     * @memberOf ShareDialogController#
     */
    function cancel() {
      $mdDialog.cancel();
    }

    /**
     * Close the share dialog and save the share mode.
     * 
     * @memberOf ShareDialogController.
     */
    function save() {
      $mdDialog.hide();
    }
  }
})();