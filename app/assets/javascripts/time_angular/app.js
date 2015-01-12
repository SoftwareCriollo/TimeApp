'use strict';

(function() {
  window.TimeApp = {};
  var app = angular.module('timeFrontendApp', [
    'Devise',
    'CacheStore',
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

  app.config(['$httpProvider', function($httpProvider){    
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
//    $httpProvider.defaults.headers.common['X-USER-TOKEN'] = currentUser.token();
    var interceptor = ['$location', '$rootScope', '$q', function($location, $rootScope, $q) {
      function success(response) {
        return response
      };

      function error(response) {
        if (response.status == 401) {
          $rootScope.$broadcast('event:unauthorized');
          $location.path('/users/login');
          return response;
        };
        return $q.reject(response);
      };
      return function(promise) {
        return promise.then(success, error);
      };
    }];
    $httpProvider.interceptors.push(interceptor);
  }]);
  
  app.config(function ($routeProvider) {
    $routeProvider
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
      .when('/log-in', {
        templateUrl: 'templates/authentication/login.html',
        controller: 'LoginController',
        controllerAs: 'auth'
      })
      .when('/iterations/:projectId', {
        templateUrl: 'templates/iterations/index.html'
      })
      .otherwise({
        redirectTo: '/projects'
      });
  });
})();
