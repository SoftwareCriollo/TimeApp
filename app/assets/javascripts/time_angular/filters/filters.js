'use strict';
(function(){
  
  var app = angular.module('timeFrontendApp-filters',['CacheStore','Repository'])

  app.filter('dateSuffix', function($filter) {
    var suffixes = ["th", "st", "nd", "rd"];
    return function(input) {
      var dtfilter = $filter('date')(new Date(input), 'MMMM dd');
      var day = parseInt(dtfilter.slice(-2));
      var relevantDigits = (day < 30) ? day % 20 : day % 30;
      var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
      return dtfilter.toUpperCase()+suffix;
    };
  });

  app.filter('ddSuffix', function($filter) {
    var suffixes = ["th", "st", "nd", "rd"];
    return function(input) {
      var dtfilter = $filter('date')(new Date(input), 'dd');
      var day = parseInt(dtfilter.slice(-2));
      var relevantDigits = (day < 30) ? day % 20 : day % 30;
      var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
      return dtfilter+suffix;
    };
  });

  app.filter('hours', function(){
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

})();