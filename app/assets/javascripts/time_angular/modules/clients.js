'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-clients',['CacheStore'])

  app.controller('ClientsController',['ClientsRepository','$routeParams','$http','CurrentUser','ProjectCache','$location', function(clientsRepository,$routeParams,$http, currentUser,projectCache,$location){

    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    clientsRepository.setProjectId(projectId);

    clientsRepository.findClient(function(client, status, headers, config){
      if(client.name==null)
      {
        $location.path('/projects/'+projectId+'/new_client');
        console.log("The client is no registrated.");
      }
      else
      {
        console.log("Client: " + client.name);
        controller.client = client;
      }

    });

    this.SaveClient = function(){
      if(this.client.project_id==null)
      { 
        this.client.project_id = projectId;
        clientsRepository.saveClient(controller.client.toJsonToServer(), function() {
          $location.path('/projects/'+projectId+'/client');
          controller.clearForm();
        },
        function() {
          controller.error=true;      
        });
        
      }
      else
      {
        
      }
    };

    this.clearForm = function(){
      location.reload();
    };

    this.editClient = function(){
      $location.path('/projects/'+projectId+'/new_client');
    };

  }]);


})();

