/* global angular */
var taskplannerApp = angular.module("taskplanner", ['ui.router', 'ngCookies', 'ngSanitize', 'pascalprecht.translate', 'cfp.hotkeys',
  'growlNotifications', 'uuid', 'angular-md5'
]);

/**
 * Global application configuration
 */
taskplannerApp.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$httpProvider',
  function($stateProvider, $urlRouterProvider, $translateProvider, $httpProvider) {

    /** ************************************ */
    /** ***** Disable request caching ****** */
    /** ************************************ */
    // initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    // disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    /** ************************************ */
    /** *** Check if a user is available *** */
    /** ************************************ */
    function resolveUser(AuthService) {
      return AuthService.loadUser();
    }

    /** **************************************** */
    /** ** Add an interceptor for AJAX errors ** */
    /** **************************************** */
    $httpProvider.interceptors.push(function($rootScope, $q, $location, $window) {
      return {
        request: function(config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          }
          return config;
        },
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401) {
            $location.path('/login');
          } else if (response.status === 403) {
            $location.path('/error/403');
          } else if (response.status === 404) {
            $location.path('/error/404');
          } else if (response.status === 500) {
            $location.path('/error/500');
          }
          return $q.reject(response);
        }
      };
    });

    /** **************************************** */
    /** ****** Translation configuration ******* */
    /** **************************************** */
    $translateProvider.useStaticFilesLoader({
      prefix: 'resources/i18n/locale-',
      suffix: '.json'
    }).preferredLanguage('en_US').fallbackLanguage('en_US').useLocalStorage();
    $translateProvider.useSanitizeValueStrategy('sanitize');

    /** **************************************** */
    /** ********* State configuration ********** */
    /** **************************************** */
    $stateProvider.state('home', {
      // Home
      url: '/',
      templateUrl: 'partials/content.html',
      controller: 'ContentController',
      controllerAs: 'vm',
      resolve: {
        user: resolveUser
      }
    }).state('login', {
      // Login
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'LoginController',
      controllerAs: 'vm',
      resolve: {
        user: resolveUser
      }
    }).state('profile', {
      url: '/profile',
      templateUrl: 'partials/profile.html',
      resolve: {
        user: resolveUser
      }
    }).state('500', {
      url: '/error/500',
      templateUrl: 'partials/500.html',
      resolve: {
        user: resolveUser
      }
    }).state('403', {
      url: '/error/403',
      templateUrl: 'partials/403.html',
      resolve: {
        user: resolveUser
      }
    }).state('404', {
      url: '/error/404',
      templateUrl: 'partials/404.html',
      resolve: {
        user: resolveUser
      }
    });

    // Default state (Home)
    $urlRouterProvider.otherwise('/');
  }
]);