'use strict';
(function(){

  var $$cache = {};

  function isMemoized(filterName, args) {
    var hashKey = getHashKey(filterName, args);
    return $$cache[hashKey];
  }

  function memoize(filterName, args, scope, result) {
    var hashKey = getHashKey(filterName, args);
    $$cache[hashKey] = result;

    if(isScope(scope)) {
      addListener(scope, hashKey);
    } else {
      cleanStateless();
    }
    return result;
  }	 
  function getHashKey(fName, args) {
    return [fName, angular.toJson(args)]
      .join('#')
      .replace(/"/g,'');
  }
  
  function isScope(obj) {
	return obj && obj.$evalAsync && obj.$watch;
  }
	
  function cleanStateless() {}	
	
  var app = angular.module('timeFrontendApp-filters',['CacheStore','Repository'])
	
   app.filter('groupBy', [ '$parse', function ( $parse) {
     return function (collection, property) {
       if(!angular.isObject(collection) || angular.isUndefined(property)) {
         return collection;
       }

       var getterFn = $parse(property);

       return isMemoized('groupBy', arguments) ||
         memoize('groupBy', arguments, this,
           _groupBy(collection, getterFn));

       function _groupBy(collection, getter) {
         var result = {};
         var prop;

         angular.forEach( collection, function( elm ) {
           prop = getter(elm);

           if(!result[prop]) {
             result[prop] = [];
           }
           result[prop].push(elm);
         });
         return result;
       }
     }
  }]);

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