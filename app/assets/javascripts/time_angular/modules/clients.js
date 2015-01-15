'use strict';
(function(){
  var app = angular.module('timeFrontendApp-clients',['CacheStore'])

  app.controller('ClientsController',['$http','CurrentUser', function($http, currentUser){

    currentUser.isPendingAuth();

    var controller = this;

    this.clientsArray = [];

    this.newClient = function() {
      if (this.clients.client_name && this.clients.client_email && this.clients.client_git && this.clients.client_ssh) {
         this.addClient();
      }
      console.log(this.clientsArray);
    };

    this.addClient = function(){
      var dateClient = {};
      dateClient.client_name = this.clients.client_name;
      dateClient.client_email = this.clients.client_email;
      dateClient.client_git = this.clients.client_git;
      dateClient.client_ssh = this.clients.client_ssh;

      this.clientsArray.push(dateClient);

      this.resetForm();
    };

    this.resetForm = function(){
      this.clients.client_name = '';
      this.clients.client_email = '';
      this.clients.client_git = '';
      this.clients.client_ssh = '';
    };


  }]);

  app.controller('InfoClientsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){

    currentUser.isPendingAuth();

    var controller = this;

    var projectId = $routeParams.projectId;
    this.project = projectCache.findProject(projectId);

  }]);


})();

