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
  });

  window.logOut = function(){
    localstorage.clear();
    window.location= "/";
  };
})();
