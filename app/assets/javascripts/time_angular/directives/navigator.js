'use strict';
(function(){

  var app = angular.module('timeFrontendApp-navigator',['Devise','CacheStore'])

  app.directive('navigatorproject', function() {
    return {
      restrict: 'E',
      scope: {
        project: '=project',
        section: '=section'
      },
      controller: 'NavigatorController',
      controllerAs: 'ctrl',
      templateUrl: 'templates/navigators/projects.html'
    };
  })

  app.directive('loading', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs){
        scope.isLoading = function () {
            return $http.pendingRequests.length > 0;
        };

        scope.$watch(scope.isLoading, function (v){
          if(v){
              elm.show();
          }else{
              elm.hide();
          }
        });
      }
    };
  }]);

  app.controller('NavigatorController',['$location', function($location){
    this.logOut = function(){
      localStorage.clear();
      window.location= "/log-in";
      location.reload();
    };
  }]);
  
})();
