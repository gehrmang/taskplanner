/* global angular */
var taskplannerApp = angular.module("taskplanner", ['ui.router', 'ngMaterial', 'ngMessages', 'ngCookies', 'ngSanitize', 'pascalprecht.translate', 'cfp.hotkeys',
  'growlNotifications', 'uuid', 'angular-md5', 'monospaced.elastic'
]);

/**
 * Global application configuration
 */
taskplannerApp.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$httpProvider', '$mdThemingProvider',
  function($stateProvider, $urlRouterProvider, $translateProvider, $httpProvider, $mdThemingProvider) {

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
      },
      auth: {}
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
      controller: 'ProfileController',
      controllerAs: 'vm',
      resolve: {
        user: resolveUser
      },
      auth: {}
    }).state('users', {
      url: '/users',
      templateUrl: 'partials/users.html',
      resolve: {
        user: resolveUser
      },
      auth: {
        admin: true
      }
    }).state('users.list', {
      url: '/list',
      templateUrl: 'partials/userlist.html',
      controller: 'UserController',
      controllerAs: 'vm',
      resolve: {
        user: resolveUser
      },
      auth: {
        admin: true
      }
    }).state('users.edit', {
      url: '/edit/:username',
      templateUrl: 'partials/edituser.html',
      controller: 'UserEditController',
      controllerAs: 'vm',
      resolve: {
        user: resolveUser
      },
      auth: {
        admin: true
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

    $mdThemingProvider.definePalette('amazingPaletteName', {
      '50': '1d61a6',
      '100': '1d61a6',
      '200': '1d61a6',
      '300': '1d61a6',
      '400': '1d61a6',
      '500': '1d61a6',
      '600': '1d61a6',
      '700': '1d61a6',
      '800': '1d61a6',
      '900': '1d61a6',
      'A100': '1d61a6',
      'A200': '1d61a6',
      'A400': '1d61a6',
      'A700': '1d61a6',
      'contrastDefaultColor': 'light', // whether, by default, text (contrast)
      // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('amazingPaletteName');
  }
]);

taskplannerApp.run(function($state, $rootScope, AuthService) {
  $rootScope.$state = $state;

  $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    if (!to.auth) {
      return;
    }

    if (to.auth.admin && AuthService.isAdminUser()) {
      return;
    }

    if (AuthService.getUser()) {
      return;
    }

    ev.preventDefault();
    $state.transitionTo('login');
  });
});
