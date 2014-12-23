'use strict';
(function() {
  var app = angular.module('timeFrontendApp', [
    'timeFrontendApp-authentication',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ]);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/log-in', {
        templateUrl: 'templates/authentication/login.html',
        controller: 'LoginController'
      })
      .otherwise({
        redirectTo: '/log-in'
      });
  });
})();
