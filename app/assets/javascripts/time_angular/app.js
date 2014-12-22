'use strict';
angular
  .module('timeFrontendApp', [
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/hello2.html',
        controller: 'LoginController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });