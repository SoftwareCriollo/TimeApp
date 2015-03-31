'use strict';
(function(){

   var app = angular.module('timeFrontendApp-navigator',['Devise','CacheStore'])
  .directive('navigatorproject', function() {
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
  .filter('hours', function(){
    return function(hour){
      if (hour>=1 && hour<2){
        return hour+' Hour';
      }else if (hour>=2) {
        return hour+' Hours';  
      }else if (hour<1) {
        return hour+' Hour';  
      }
    }
  })

  app.controller('NavigatorController',['$location', function($location){
    var controller = this;

    this.logOut = function(){
      localStorage.clear();
      window.location= "/log-in";
      location.reload();
    };
  }]);
  
})();
