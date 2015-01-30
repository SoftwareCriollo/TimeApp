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

    $provide.factory('TimeLoggerRepository',["Repository",function(repository) {
      this.route = "/api/timelogs";
      this.create = function(data,success_callback){
        repository.post(this.route,{"timelogger":data},success_callback);
      };
      this.edit = function(object,success_callback){        
        repository.post(this.route,{"timelog":data},success_callback);        
      };
      this.createRoute= function(){
        return this.route;
      };
      this.patchRoute= function(data){
        return this.route + "/"+data.timelog_id;
      };
      return this;
    }]);

    $provide.factory('IterationsRepository',["Repository",function(repository) {
      this.route = undefined;
      this.projectId = undefined;

      this.setProjectId = function(projectId){
        this.projectId = projectId;
        this.route = '/api/iterations';
      };

      this.get = function(success_callback){
        if( this.projectId === undefined)
          console.error("You must set projectId");
        else
          repository.get(this.route,success_callback);
      };

      this.saveIterations = function(iteration,success_callback){
        repository.post('/api/iterations/', {"iteration":iteration}, success_callback);
        
      };
      
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
      this.post = function(route,data,success_callback,error_callback){
        error_callback = error_callback || function(){}
        $http.post(route,data, {"headers":this.setHeaders()})
          .success(success_callback)
          .error(function(data, status, headers, config) {
            if(status == 401)
              closeSession();
            else if (status == 422)
              error_callback(data,status,headers,config);

          });
      };
      this.patch = function(route,data,success_callback,error_callback){
        error_callback = error_callback || function(){}
        $http.patch(route,data,{"headers":this.setHeaders()})
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
