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
    'timeFrontendApp-performance',
    'timeFrontendApp-clients',
    'timeFrontendApp-navigator',
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
      .when('/project/iterations/:iterationId/entries', {
        templateUrl: 'templates/iterations/entries.html',
        controller: 'TimelogController',
        controllerAs: 'ctrl'
      })
      .when('/clients/:projectId/client', {
        templateUrl: "templates/clients/client.html",
        controller: 'InfoClientsController',
        controllerAs: 'controller'
      })
      .when('/clients/new_client', {
        templateUrl: "templates/clients/new_client.html",
        controller: 'ClientsController',
        controllerAs: 'controller'
      })
      .when('/performance', {
        templateUrl: 'templates/performance/index.html',
        controller: 'GeneralPerformanceController',
        controllerAs: 'controller'
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
      .when('/performance/project/:projectId', {
        templateUrl: 'templates/performance/performance.html',
        controller: 'PerformanceController',
        controllerAs: 'controller'
      })
      .otherwise({
        redirectTo: '/projects'
      });
  });
})();
