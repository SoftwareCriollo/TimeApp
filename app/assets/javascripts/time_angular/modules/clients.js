'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-clients',['CacheStore'])

  app.controller('ClientsController',['ClientsRepository','$routeParams','$http','CurrentUser','ProjectCache', function(clientsRepository,$routeParams,$http, currentUser,projectCache){

    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    this.client = new TimeApp.Client({project_id: projectId});
    clientsRepository.setProjectId(projectId);

    clientsRepository.findClient(function(client, status, headers, config){
      if(client.name==null)
      {
        controller.new_client = false;
        console.log("The client is no registrated.");
      }
      else
      {
        controller.new_client = true;
        console.log("Client: " + client.name);

        controller.client = client;
      }

    });

    this.SaveClient = function(){
      this.client.project_id = projectId;
      clientsRepository.saveClient(controller.client.toJsonToServer(), function() {
        controller.clearForm();
      },
      function() {
        controller.error=true;      
      });
    };

    this.clearForm = function(){
      location.reload();
    };

    this.editClient = function(){
      controller.new_client = false;
    };

  }]);


})();

