(function(){
  var TimeApp = window.TimeApp;
  var CacheStoreModule = angular.module('Repository', ["CacheStore"]);

  CacheStoreModule.config(['$provide', function($provide) {

    $provide.factory('ProjectRepository',["Repository",function(repository) {
      this.route = "/api/projects";

      this.get = function(success_callback){
        repository.get(this.route,success_callback);
      } 
      return this;
    }]);

    $provide.factory('CardRepository',["Repository",function(repository) {
      this.route = undefined;
      this.projectId = undefined;

      this.setProjectId = function(projectId){
        this.projectId = projectId;
        this.route = '/api/projects/' + projectId + '/cards';
      };

      this.get = function(success_callback){
        if( this.projectId === undefined)
          console.error("You must set projectId");
        else
          repository.get(this.route,success_callback);
      } 
      return this;
    }]);
    
    $provide.factory('Repository',["$http",'CurrentUser',function($http,currentUser) {
      this.get = function(route,success_callback,error_callback){
        error_callback = error_callback || function(){}
        $http.get(route, {"headers":this.setHeaders()})
          .success(success_callback)
          .error(function(data, status, headers, config) {
            if(status == 401)
              closeSession();
            else if (status == 422)
              error_callback(data,status,headers,config);
          });
      };
      this.post = function(route,success_callback,error_callback){
        error_callback = error_callback || function(){}
        $http.post(route, {"headers":this.setHeaders()})
          .success(success_callback)
          .error(function(data, status, headers, config) {
            if(status == 401)
              closeSession();
            else if (status == 422)
              error_callback(data,status,headers,config);

          });
      };
      this.setHeaders = function(params){
        params = params || {}
        return $.extend(params,{token: currentUser.token()});
      }

      //private functions
      var closeSession = function(){
        localStorage.clear();
        location.reload();
      }
      return this;
    }]);

  }]);
})();
