'use strict';
(function(){

  angular.module('timeFrontendApp-navigator', [])
  .directive('navigatorproject', function() {
    return {
      restrict: 'E',
      scope: {
        project: '=project',
        section: '=section'
      },
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
  });

  window.logOut = function(){
    localstorage.clear();
    window.location= "/";
  };
})();
