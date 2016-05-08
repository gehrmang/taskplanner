/* global angular, moment */
/*
 * tasklist-service.js: GNU GENERAL PUBLIC LICENSE Version 3
 */

angular.module("taskplanner").filter('localdate', ['$translate', 'AuthService', function($translate, AuthService) {
  return function(input) {
    if (!input) {
      return;
    }
    
    var date = moment(input);
    date.locale(AuthService.getUser().language);
    return date.format($translate.instant('GLOBAL.DATE.' + AuthService.getUser().language));
  };
}]);
