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
    var json = '/api/timeline/' + projectId;
    this.paint = new TimeApp.Paint(json);

    this.setPrefixToShare = function(){
      this.route = window.location.origin+"/#/timeline/report/" + projectId;
    };

    this.setUrlToShare = function(){
      this.setPrefixToShare();
      controller.urlShare = this.route;
      controller.getShortUrl(controller.urlShare);
    };

    this.getShortUrl = function(url){
      var long_url = url;
      var login = "o_32g0fvedmb";
      var api_key = "R_00527cbbec5e4ac6afec3245e4a01039";

      $.getJSON("https://api-ssl.bitly.com/v3/shorten?callback=?", {
          "format": "json",
          "apiKey": api_key,
          "login": login,
          "longUrl": long_url
        },
        function(response){
          if(response.status_code != 500){
            controller.urlShare = response.data.url;
          }else{
            controller.urlShare = url;
          }
          controller.shortlink = true;
        });
    };

    this.setUrlToShare();

  }]);

})();

