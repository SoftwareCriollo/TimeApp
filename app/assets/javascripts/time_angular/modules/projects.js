'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-projects',['CacheStore','Repository'])

  app.controller('ProjectsController',['ProjectRepository','CurrentUser','ProjectCache', function(projectRepository,currentUser,projectsCache){

    this.logOut = function(){ // function to "log out" the user, clear all the local storage
      localStorage.clear();
      location.reload();
    };
    currentUser.isPendingAuth();

    var controller = this;
    this.projects = projectsCache.projects;

    projectRepository.get(function(projects, status, headers, config){
      projectsCache.saveProjects(projects);
      controller.projects = projects;
    });

  }]);

  app.controller('CardsController',['CardRepository','TimeLoggerRepository','$routeParams','CurrentUser','ProjectCache','CardsCache', function(cardRepository,timeLoggerRepository,$routeParams, currentUser,projectCache,cardsCache){

    var controller = this;
    var projectId = $routeParams.projectId;
    this.timeLogger = new TimeApp.TimeLogger();

    currentUser.isPendingAuth();

    this.project = projectCache.findProject(projectId);
    this.cards = cardsCache.loadCards(projectId);

    cardRepository.setProjectId(projectId);
    cardRepository.get(function(cards, status, headers, config){
      cardsCache.saveCards(projectId,cards);
      controller.cards = cards;
    });

    this.saveTimeLogger = function(){

    };
    
    this.logOut = function(){ // function to "log out" the user, clear all the local storage
      localStorage.clear();
      location.reload();
    };

  }]);
})();

