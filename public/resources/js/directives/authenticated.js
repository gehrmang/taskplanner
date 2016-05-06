/* global angular */
/*
 * authenticated.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Directive that hides an element if the current user is not authenticated.
   * 
   * @autor Gerry Gehrmann
   * @since 0.0.1
   */
  angular.module("taskplanner").directive('authenticated', Authenticated);

  Authenticated.$inject = ['AuthService'];
  
  /**
   * @name Authenticated
   * @class
   * @property {Object} AuthService - The authentication service
   */
  function Authenticated(AuthService) {

    return {
      link : function(scope, element, attrs) {
        var value = attrs.authenticated;
        var parent = element.parent();

        function toggleVisibilityBasedOnPermission() {
          if (((!value || value === '' || value === 'true') && AuthService.getUser() != undefined) || (value === 'false' && AuthService.getUser() === undefined)) {
            parent.append(element);
          } else {
            element.detach();
          }
        }

        toggleVisibilityBasedOnPermission();
        scope.$on('authentication', toggleVisibilityBasedOnPermission);
      }
    };
  }
})();
