/* global angular, btoa */

/*
 * gravatar-service.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";
  /**
   * Service for Gravatar access.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module('taskplanner').factory('GravatarService', GravatarService);

  GravatarService.$inject = ['md5', 'AuthService'];

  /**
   * Gravatar Service implementation
   * 
   * @class
   * @name GravatarService
   * @param {Object} md5 - The md5 hashing service
   * @param {Object} AuthService - The authentication service
   */
  function GravatarService(md5, AuthService) {

    var GRAVATAR_BASE = 'https://www.gravatar.com/avatar/';

    /**
     * The service interface
     * 
     * @fieldOf GravatarService#
     * @private
     * @interface
     */
    var service = {
      getUrl: getUrl
    };

    return service;

    /**
     * Generate the user based Gravatar URL.
     * 
     * @memberOf GravatarService#
     * @param {number} size - The Gravatar size in pixel
     * @returns The generated Gravatar URL
     */
    function getUrl(size) {
      var user = AuthService.getUser();

      if (user && user.email) {
        return GRAVATAR_BASE + md5.createHash(AuthService.getUser().email) + '?s=' + size + '&d=retro';
      } else {
        return '/resources/img/shapes/person.png';
      }
    }
  }

})();
