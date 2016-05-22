/* global angular, moment */
/*
 * tasklist-search-filter.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
angular.module("taskplanner").filter('taskListSearch', TaskListSearchFilter);

TaskListSearchFilter.$inject = [];

/**
 * Angular filter for displaying a date according to the users language setting.
 * 
 * @name TaskListSearchFilter
 * @class
 */
function TaskListSearchFilter() {
  return function(array, input) {
    if (!input) {
      return array;
    }

    var filtered = array.filter(function(e) {
      var fullname = e.owner.firstname + ' ' + e.owner.name;
      return e.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || fullname.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    });

    return filtered;
  };
}
