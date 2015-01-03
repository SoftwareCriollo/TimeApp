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

  }]);
})();
