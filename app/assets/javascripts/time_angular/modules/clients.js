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
    clientsRepository.setProjectId(this.project.id);

    clientsRepository.findClient(function(){

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


  }]);

  app.controller('InfoClientsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){

    currentUser.isPendingAuth();

    var controller = this;

    var projectId = $routeParams.projectId;
    this.project = projectCache.findProject(projectId);

  }]);


})();

