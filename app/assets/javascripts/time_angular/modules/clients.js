'use strict';
(function(){
  var app = angular.module('timeFrontendApp-clients',['CacheStore'])

  app.controller('ClientsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){

    currentUser.isPendingAuth();

    var controller = this;

    var projectId = $routeParams.projectId;
    this.project = projectCache.findProject(projectId);

  }]);


})();

