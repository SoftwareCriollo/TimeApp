(function(){
  var CacheStoreModule = angular.module('CacheStore', []);

  CacheStoreModule.config(['$provide', function($provide) {
    $provide.factory('CurrentUser',["$location",function($location) {
      var currentUser;

      this.id= function(){
        currentUser.id;
      };

      this.isAuthenticated = function(){
        return currentUser.token_authentication != undefined;
      };
      this.changeUser = function(user){
        currentUser = user;
      };

      this.saveCache = function(){
        saveJsonCache('currentUser',currentUser);
      };

      this.checkAuth = function(){      
        if(this.isAuthenticated()){
          $location.path('/');
        }
      }
      this.pendingAuth = function(){      
        if( !this.isAuthenticated()){
          $location.path('/log-in');
        }
      }
      if( existCache("currentUser") )
        currentUser = new TimeApp.User( loadJsonCache("currentUser") );
      else
        currentUser = new TimeApp.User();



      return this;
    }]);

  }]);

  var saveJsonCache = function(name,obj){
    localStorage[name] = JSON.stringify(obj);
  };

  var loadJsonCache = function(name){
    console.log(localStorage[name]);
    return JSON.parse(localStorage[name]);
  };

  var existCache = function(name){
    return localStorage[name] != undefined
  };
})();
