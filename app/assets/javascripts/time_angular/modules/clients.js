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
        this.client = new TimeApp.Client();
        $location.path('/projects/'+projectId+'/new_client');
      }
      else
      {
        clientsRepository.setClientId(client._id.$oid);
        controller.client  = new TimeApp.Client(client);
      }

    });

    this.SaveClient = function(){
      console.log(this.client.project_id);
      if(this.client.project_id==null)
      {
      console.log("create"); 
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
        console.log("update");
        clientsRepository.updateClient(controller.client.toJsonToServer(), function() {
          $location.path('/projects/'+projectId+'/client');
          controller.clearForm();
        },
        function() {
          controller.error=true;      
        });
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

