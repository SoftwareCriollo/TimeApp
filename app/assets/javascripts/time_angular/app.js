'use strict';
(function() {
  window.TimeApp = {};
  var app = angular.module('timeFrontendApp', [
    'Devise',
    'CacheStore',
    'Repository',
    'timeFrontendApp-authentication',
    'timeFrontendApp-projects',
    'timeFrontendApp-iterations',
    'timeFrontendApp-generalPerformance',	  
    'timeFrontendApp-performance',
    'timeFrontendApp-clients',
    'timeFrontendApp-navigator',
    'timeFrontendApp-filters',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ]);

  app.config(["AuthProvider",function(AuthProvider) {
    AuthProvider.loginPath('/mongoid_users/sign_in.json');
    AuthProvider.loginMethod('POST');
    AuthProvider.resourceName('mongoid_user');
    AuthProvider.parse(function(response) {
      var user = response.data.user;
      user.id = user._id["$oid"];
      return user;
    });
  }]);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/log-in', {
        templateUrl: 'templates/authentication/login.html',
        controller: 'LoginController',
        controllerAs: 'auth'
      })
      .when('/log-in/:sended', {
        templateUrl: 'templates/authentication/login.html',
        controller: 'LoginController',
        controllerAs: 'auth'
      })
      .when('/projects', {
        templateUrl: "templates/projects/index.html",
        controller: 'ProjectsController',
        controllerAs: 'controller'
      })
      .when('/projects/:projectId/cards', {
        templateUrl: "templates/projects/cards.html",
        controller: 'CardsController',
        controllerAs: 'ctrl'
      })
      .when('/projects/:projectId/iterations', {
        templateUrl: 'templates/iterations/index.html',
        controller: 'IterationsController',
        controllerAs: 'ctrl'
      })
      .when('/iterations/:iterationId/entries', {
        templateUrl: 'templates/iterations/entries.html',
        controller: 'TimelogsController',
        controllerAs: 'ctrl'
      })
      .when('/iterations/:iterationId/entries/report', {
        templateUrl: 'templates/iterations/report.html',
        controller: 'TimelogsController',
        controllerAs: 'ctrl'
      })
      .when('/projects/:projectId/client', {
        templateUrl: "templates/clients/client.html",
        controller: 'ClientsController',
        controllerAs: 'ctrl'
      })
      .when('/projects/:projectId/new_client', {
        templateUrl: "templates/clients/new_client.html",
        controller: 'ClientsController',
        controllerAs: 'ctrl'
      })
      .when('/timeline/project/:projectId', {
        templateUrl: 'templates/timeline/project.html',
        controller: 'TimelineController',
        controllerAs: 'ctrl'
      })
      .when('/timeline/report/:projectId', {
        templateUrl: 'templates/timeline/report.html',
        controller: 'TimelineController',
        controllerAs: 'ctrl'
      })
      .when('/performance', {
        templateUrl: 'templates/performance/index.html',
        controller: 'GeneralPerformanceController',
        controllerAs: 'ctrl'
      })
      .when('/performance/report', {
        templateUrl: 'templates/performance/report.html',
        controller: 'GeneralPerformanceController',
        controllerAs: 'ctrl'
      })
      .when('/performance/search', {
        templateUrl: 'templates/performance/search.html',
        controller: 'GeneralPerformanceController',
        controllerAs: 'controller'
      })
      .when('/performance/search/:projectId', {
        templateUrl: 'templates/performance/search_by_project.html',
        controller: 'PerformanceController',
        controllerAs: 'controller'
      })
      .when('/performance/general', {
        templateUrl: 'templates/performance/general.html',
        controller: 'PerformanceController',
        controllerAs: 'ctrl'
      })
      .when('/performance/project/:projectId', {
        templateUrl: 'templates/performance/performance.html',
        controller: 'PerformanceController',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/projects'
      });
  });
})();
