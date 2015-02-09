'use strict';
(function(){
  var app = angular.module('timeFrontendApp-clients',['CacheStore'])

  app.controller('ClientsController',['ClientsRepository','$routeParams','$http','CurrentUser','ProjectCache', function(clientsRepository,$routeParams,$http, currentUser,projectCache){

    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    this.client = new TimeApp.Client({project_id: projectId});


    this.SaveClient = function(){
      clientsRepository.saveClient(controller.client.toJsonToServer(), function() {
        controller.clearForm();
      },
      function() {
        controller.error=true;      
      });
    };

    this.clearForm = function(){
      this.client.client_name = '';
      this.client.client_email = '';
      this.client.client_git = '';
      this.client.client_ssh = '';
    };


  }]);

  app.controller('InfoClientsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){

    currentUser.isPendingAuth();

    var controller = this;

    var projectId = $routeParams.projectId;
    this.project = projectCache.findProject(projectId);

  }]);


})();

