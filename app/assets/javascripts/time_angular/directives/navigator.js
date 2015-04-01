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

  app.controller('NavigatorController',['$location', function($location){
    this.logOut = function(){
      localStorage.clear();
      window.location= "/log-in";
      location.reload();
    };
  }]);
  
})();
