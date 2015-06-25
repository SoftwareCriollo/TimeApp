'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-projects',["timeFrontendApp-navigator",'CacheStore','Repository'])

  app.controller('ProjectsController',['ProjectRepository','UsersRepository','ClientsRepository','CurrentUser','ProjectCache', 'ClientsCache', function(projectRepository,usersRepository,clientsRepository,currentUser,projectsCache,clientsCache){

    this.logOut = function(){ // function to "log out" the user, clear all the local storage
      localStorage.clear();
      location.reload();
    };
    currentUser.isPendingAuth();

    var controller = this;
    
    projectRepository.get(function(projects, status, headers, config){
      projectsCache.saveProjects(projects);
      controller.projects = projects;
    });

    this.projects = projectsCache.projects;

    clientsRepository.findAllClients(function(clients, status, headers, config){
      clientsCache.saveClients(clients);
    });

  }]);

  app.controller('CardsController',['CardRepository','TimeLoggerRepository','$routeParams','CurrentUser','ProjectCache','CardsCache', function(cardRepository,timeLoggerRepository,$routeParams, currentUser,projectCache,cardsCache){

    var controller = this;
    var projectId = $routeParams.projectId;

    currentUser.isPendingAuth();

    this.project = projectCache.findProject(projectId);

    this.timeLogger = new TimeApp.TimeLogger({project: this.project});
    this.cards = cardsCache.loadCards(projectId);

    cardRepository.setProjectId(projectId);


    cardRepository.get(function(cards, status, headers, config){
      cardsCache.saveCards(projectId,cards);
      var cardsGrouped = new TimeApp.FieldGrouper(cards).group_by('list_name');
      controller.cardsGroup = cardsGrouped;
      controller.cards = cards;
    });

    this.saveTimeLogger = function(){
      this.timeLogger.project_id = projectId;
      this.timeLogger.project_name = this.project.name;
      timeLoggerRepository.saveTimeLogger(this.timeLogger.toJson(),this.success,this.error);  
    };

    this.success = function(data, status, headers, config){
      alert('Created');
      location.reload();
    };
    
    this.error = function(data, status, headers, config){
      controller.errors = data;
    };

    
    this.logOut = function(){ // function to "log out" the user, clear all the local storage
      localStorage.clear();
      location.reload();
    };

  }]);

  app.controller('TimelineController',['$routeParams','ProjectCache', function($routeParams,projectCache){

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    var file = 'assets/time_angular/timeline/me.co';
    this.Paint = new TimeApp.Paint(file);

  }]);

})();

