'use strict';

(function() {
  window.TimeApp = {};
  var app = angular.module('timeFrontendApp', [
    'Devise',
    'timeFrontendApp-authentication',
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
    var interceptor = ['$location', '$rootScope', '$q', function($location, $rootScope, $q) {
      function success(response) {
        console.log(response)
        return response
      };

      function error(response) {
        console.log('HERE');
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
      .when('/', {
        templateUrl: "templates/new_iteration.html"
      })
      .when('/log-in', {
        templateUrl: 'templates/authentication/login.html',
        controller: 'LoginController',
        controllerAs: 'auth'
      })
      .otherwise({
        redirectTo: '/log-in'
      });
  });
})();
