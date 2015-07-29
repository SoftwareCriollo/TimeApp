(function(){
  var TimeApp = window.TimeApp;
  var CacheStoreModule = angular.module('Repository', ["CacheStore"]);

  CacheStoreModule.config(['$provide', function($provide) {

    $provide.factory('ProjectRepository',["Repository",function(repository) {
      this.route = "/api/projects";

      this.get = function(success_callback){
        repository.get(this.route,success_callback);
      }

      this.findProjectByName = function(projectId, success_callback){
        this.route = "/api/projects/"+projectId;
        repository.get(this.route,success_callback);
      };

      return this;
    }]);

    $provide.factory('UsersRepository',["Repository",function(repository) {
      this.route = '/api/mongoid_users';

      this.getUsers = function(success_callback){
        repository.get(this.route,success_callback);
      };

      this.findUser = function(userId, success_callback){
        this.route = '/api/mongoid_users/'+userId
        repository.get(this.route,success_callback);
      };
      
      return this;
    }]);

    $provide.factory('TimeLoggerRepository',["Repository",function(repository) {
      this.route = "/api/timelogs";

      this.create = function(data,success_callback){
        repository.post(this.route,{"timelogger":data},success_callback);
      };

      this.edit = function(timelog,success_callback){
        this.route = "/api/timelogs";
        repository.patch(this.patchRoute(timelog),{"timelog":timelog},success_callback);        
      };
      
      this.setPrefixToBackend = function(){
        this.route= "/api/timelogs/?"; 
      };

      this.setPrefixToShare = function(){
        this.route = window.location.origin+"/#/performance/report/?";
      };

      this.abstractUrlBuilder = function(urlData){
        var results = [];
        for(attr in urlData){
          results.push( attr + "="+urlData[attr]);
        }
        this.route += results.join('&');
      };

      this.get = function(success_callback){
        repository.get(this.route,success_callback);
      };

      this.createRoute= function(){
        return this.route;
      };

      this.patchRoute= function(timelog){
        return this.route + "/"+timelog["_id"]["$oid"];
      };

      //Timelogger
      this.saveTimeLogger = function(timelogger,success_callback,error_callback){
        repository.post('/api/timelogs/', {"timelogger":timelogger}, success_callback,error_callback);
      };

      return this;
    }]);


    $provide.factory('ClientsRepository',["Repository",function(repository) {
      this.route = undefined;
      this.projectId = undefined;
      this.clientId = undefined;

      this.setProjectId = function(projectId){
        this.projectId = projectId;
        this.route = '/api/projects/'+projectId+'/clients';
      };

      this.setClientId = function(clientId){
        this.clientId = clientId;
        this.route = '/api/projects/'+this.projectId+'/clients/'+clientId;
      };

      this.findAllClients = function(success_callback){
        this.route = '/api/clients/';
        repository.get(this.route,success_callback);
      };

      this.findClient = function(success_callback){
        repository.get(this.route,success_callback);
      };

      this.saveClient = function(client,success_callback,error_callback){
        repository.post(this.route, {"client":client}, success_callback, error_callback);
      };

      this.updateClient = function(client,success_callback,error_callback){
        repository.patch(this.route, {"client":client}, success_callback, error_callback);
      };
      
      return this;
    }]);


    $provide.factory('IterationsRepository',["Repository",function(repository) {
      this.route_shallow = '/api/iterations';
      this.route = undefined;
      this.projectId = undefined;
      this.iterationId = undefined;

      this.setProjectId = function(projectId){
        this.projectId = projectId;
        this.route = '/api/projects/'+projectId+'/iterations';
      };

      this.index = function(success_callback){
        if( this.projectId === undefined)
          console.error("You must set projectId");
        else
          repository.get(this.route,success_callback);
      };

      this.saveIterations = function(iteration,success_callback,error_callback){
        repository.post(this.route, {"iteration":iteration}, success_callback, error_callback);
      };

      this.edit = function(iteration,success_callback){
        this.route = "/api/iterations/"+iteration["_id"]["$oid"];
        repository.patch(this.route,{"iteration":iteration},success_callback);        
      };

      this.findIteration = function(iterationId, success_callback){
        this.iterationId = iterationId;
        this.route = '/api/iterations/'+iterationId;
        repository.get(this.route,success_callback);
      };

      this.findProjectByName = function(projectId, success_callback){
        this.route = '/api/projects/name/'+projectId;
        repository.get(this.route,success_callback);
      };

      this.setParameters = function(date_start,date_end){
        this.route= "/api/iterations/"+this.iterationId+"/timelogs/?date_1="+date_start+"&date_2="+date_end;
      }

      this.setParametersToShare = function(date_start, date_end){
        this.route = window.location.origin+"/#/iterations/"+this.iterationId+"/entries/report/?date_1="+date_start+"&date_2="+date_end;
      };

      this.entries = function(success_callback){

        if( this.iterationId === undefined)
          console.error("You must set iterationId");
        else
          repository.get(this.route,success_callback);
        
      };
      
      return this;
    }]);
	
    $provide.factory('PerformanceRepository',["Repository",function(repository){
      this.route = undefined;
      this.projectId = undefined;
  		this.cardId = undefined;
  		this.dateStart = undefined
  		this.dateEnd = undefined
		
      this.setCard = function(projectId, cardId, dateStart, dateEnd){
        this.projectId = projectId;
  		  this.cardId = cardId;
  		  this.dateStart = dateStart;
  		  this.dateEnd = dateEnd;
  		  
        this.route = '/api/projects/' + projectId + '/card/' + cardId + '/logs?date_start='+ dateStart + '&date_end=' + dateEnd;
      };
		
      this.get = function(success_callback){
        if( this.projectId === undefined)
          console.error("You must set projectId");
        else
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

    $provide.factory('MemberRepository',["Repository",function(repository) {
        this.route = "/api/members";
        this.findMemberByName = function(memberId, success_callback){
            this.route = '/api/members/'+memberId;
            repository.get(this.route,success_callback);
        };
        return this;
    }]);

  }]);
})();
