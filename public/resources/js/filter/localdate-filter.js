/* global angular, moment */
/*
 * localdate-filter.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
angular.module("taskplanner").filter('localdate', LocalDateFilter);

LocalDateFilter.$inject = ['$translate', 'AuthService'];

/**
 * Angular filter for displaying a date according to the users language setting.
 * 
 * @name LocalDateFilter
 * @class
 * @param {Object} $translate - The translation service
 * @param {Object} AuthService - The authentication service
 */
function LocalDateFilter($translate, AuthService) {
  return function(input) {
    if (!input) {
      return;
    }

    var date = moment(input);
    date.locale(AuthService.getUser().language);
    return date.format($translate.instant('GLOBAL.DATE.' + AuthService.getUser().language));
  };
}
