'use strict';
(function(){
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['$http','$routeParams','CurrentUser','ProjectCache', function($http,$routeParams, currentUser,projectCache){

    var controller = this;
    var projectId = $routeParams.projectId;
    currentUser.isPendingAuth();

    this.project = projectCache.findProject(projectId);
    iterationsRepository.setProjectId(projectId);

    this.iterations = iterationsCache.iterations;
    iterationsRepository.get(function(iterations, status, headers, config){
      iterationsCache.saveIterations(iterations);
      console.log("iterations: "+iterations);
      controller.iterations = iterations;
    });
 
    this.SaveIteration = function(){
    };

  }]);


})();


