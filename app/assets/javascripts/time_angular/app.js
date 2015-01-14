'use strict';
(function() {
  window.TimeApp = {};
  var app = angular.module('timeFrontendApp', [
    'Devise',
    'CacheStore',
    'Repository',
    'timeFrontendApp-authentication',
    'timeFrontendApp-projects',
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
        controllerAs: 'controller'
      })
      .when('/projects/:projectId/client', {
        templateUrl: "templates/projects/client.html",
        controller: 'ClientsController',
        controllerAs: 'controller'
      })
      .when('/projects/new_client', {
        templateUrl: "templates/projects/new_client.html",
        controller: 'ClientsController',
        controllerAs: 'controller'
      })
      .when('/iterations/:projectId', {
        templateUrl: 'templates/iterations/index.html'
      })
      .when('/performance/:projectId', {
        templateUrl: 'templates/performance/performance.html'
      })
      .when('/performance', {
        templateUrl: 'templates/performance/index.html'
      })
      .otherwise({
        redirectTo: '/projects'
      });
  });
})();
