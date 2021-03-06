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

  app.controller('TimelineController',['$routeParams','ProjectCache', 'ProjectRepository', 'MemberRepository', function($routeParams, projectCache, projectRepository, memberRepository){

    var ctrl = this;
    var projectId = $routeParams.projectId;
    var json;

    if(projectId != null) {
        projectRepository.findProjectByName(projectId, function (projectName, status, headers, config) {
            ctrl.project_name = projectName;
        });

        this.project = projectCache.findProject(projectId);
        json = '/api/timeline/' + projectId;
        this.paint = new TimeApp.Paint(json);

        this.setPrefixToShare = function () {
            this.route = window.location.origin + "/#/timeline/report/" + projectId;
        };
    } else {

        var memberId = $routeParams.memberId;

        if(memberId != null) {
            memberRepository.findMemberByName(memberId, function (memberName, status, headers, config) {
                ctrl.memberName = memberName;
            });

            json = '/api/timeline/member/' + memberId;
            this.paint = new TimeApp.Paint(json, memberId);

            this.setPrefixToShare = function () {
                this.route = window.location.origin + "/#/timeline/report/";
            };
        } else {
            json = '/api/timeline/';
            this.paint = new TimeApp.Paint(json);

            this.setPrefixToShare = function () {
                this.route = window.location.origin + "/#/timeline/report/";
            };
        }
    }

    this.setUrlToShare = function(){
      this.setPrefixToShare();
      ctrl.urlShare = this.route;
      ctrl.getShortUrl(ctrl.urlShare);
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
            ctrl.urlShare = response.data.url;
          }else{
            ctrl.urlShare = url;
          }
          ctrl.shortlink = true;
        });
    };

    this.setUrlToShare();

  }]);

})();

