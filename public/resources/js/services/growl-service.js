/* global angular */

/*
 * growl-service.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";
  /**
   * Service for growl messages.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module('taskplanner').factory('GrowlService', GrowlService);

  GrowlService.$inject = ['$rootScope'];

  /**
   * Gravatar Service implementation
   * 
   * @class
   * @name GrowlService
   * @param {Object} $rootScope - The global root scope
   */
  function GrowlService($rootScope) {

    var TYPE_SUCCESS = 'success';
    var TYPE_ERROR = 'error';

    $rootScope.notifications = {};
    var index = 0;

    /**
     * The service interface
     * 
     * @fieldOf GrowlService#
     * @private
     * @interface
     */
    var service = {
      success: success,
      error: error
    };

    return service;


    /**
     * Add a new success notification message.
     * 
     * @memberOf GrowlService#
     * @param {string} message - The message to be added
     */
    function success(message) {
      addNotification(TYPE_SUCCESS, message);
    }

    /**
     * Add a new error notification message.
     * 
     * @memberOf GrowlService#
     * @param {string} message - The message to be added
     */
    function error(message) {
      addNotification(TYPE_ERROR, message);
    }

    /**
     * Add a new notification message of given type.
     * 
     * @param {string} type - The notification type
     * @param {string} message - The message to be added
     */
    function addNotification(type, message) {
      var i = index++;
      $rootScope.notifications[i] = {
        type: type,
        text: message
      };
    }
  }

})();
