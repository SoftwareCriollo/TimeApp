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
  app.filter('autolink', function(){

    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;

    var normalize = function(arr){
      var result = {};
      if(arr == undefined || arr == null){
        return [];
      }
      for (var i = 0, l = arr.length; i < l; i++) {
        if (!result.hasOwnProperty(arr[i])) {
          result[arr[i]] = arr[i];
        }
      }
      return result;
    };

    return function(text, target){
      if (text == null || text == undefined){
        return text ;
      }
      angular.forEach(normalize(text.match(urlPattern)), function(url) {

        text = text.replace(new RegExp(url, 'g'), '<a target="' + target + '" href="'+ url + '">' + url +'</a>');
      });
      return text;
    };

  });
})();
