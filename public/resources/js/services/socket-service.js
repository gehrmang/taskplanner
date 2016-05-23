/* global angular, io */

/*
 * socket-service.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";
  /**
   * Service for user related tasks.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module('taskplanner').factory('Socket', Socket);

  Socket.$inject = ['$rootScope'];

  /**
   * User Service implementation
   * 
   * @class
   * @name Socket
   * @param {Object} $rootScope - The global root scope
   */
  function Socket($rootScope) {

    var socket = io.connect();

    /**
     * The service interface
     * 
     * @fieldOf Socket#
     * @private
     * @interface
     */
    var service = {
      on: on,
      emit: emit
    };

    return service;


    /**
     * Socket event handler.
     * 
     * @memberOf Socket#
     * @param {string} eventName - The name of the received event
     * @callback callback
     */
    function on(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    }

    /**
     * Socket event emitter.
     * 
     * @memberOf Socket#
     * @param {string} eventName - The name of the emitted event
     * @param {Object} data - The event data
     * @callback callback
     */
    function emit(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  }

})();
