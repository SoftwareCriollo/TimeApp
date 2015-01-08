'use strict';
(function(){
  var app = angular.module('timeFrontendApp-projects',['CacheStore'])

  app.controller('ProjectsController',['$http','CurrentUser','ProjectCache', function($http,currentUser,projectsCache){
    currentUser.isPendingAuth();

    var controller = this;
    
    this.projects = projectsCache.projects;
    $http.get('/api/projects')
      .success(function(projects, status, headers, config){
        projectsCache.saveProjects(projects);
        controller.projects = projects;
      });
  }]);
  app.controller('CardsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){
    currentUser.isPendingAuth();
    var controller = this;
    var projectId = $routeParams.projectId;
    this.project = projectCache.findProject(projectId);
    this.cards = cardsCache.loadCards(projectId);

    var url = '/api/projects/' + projectId + '/cards';
    $http.get(url)
      .success(function(cards, status, headers, config){
        cardsCache.saveCards(projectId,cards);
        controller.cards = cards;
      });
    
    this.task = [];
    this.tasks=function(idCard, nameCard){
      var dateCards = {};
      dateCards.id = idCard;
      dateCards.name = nameCard;
      var add = 0;
      if(this.task!="") {
        for (var i = 0; i < this.task.length; i++) {
          if (this.task[i].id==idCard)
            {
              add=add+1;
              var remove = i;
            }
        }
        if(add==0){this.task.push(dateCards);}
        else{this.task.splice(remove,1);}
        add=0;
      }
      else{
        this.task.push(dateCards);
      }
      if(this.task!=""){
          $('.save-time-log').css("display","block");
          $('.title-time-log').css("display","inline-block");
          $('.underline-time-log').css("display","block");
        }
      else{
          $('.title-time-log').css("display","none");
          $('.save-time-log').css("display","none");
          $('.underline-time-log').css("display","none");
        }
    };

  }]);
})();



    