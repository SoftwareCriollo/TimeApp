'use strict';
(function(){
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$http','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$http,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;
    currentUser.isPendingAuth();

    this.project = projectCache.findProject(projectId);
    iterationsRepository.setProjectId(projectId);

    this.iterations = iterationsCache.iterations;
    iterationsRepository.get(function(iterations, status, headers, config){
      console.log("iterations: "+iterations);
      controller.iterations = iterations;
    });
 
    this.SaveIteration = function(){
        iterationsRepository.saveIterations(this.iteration);
    };

  }]);


})();


