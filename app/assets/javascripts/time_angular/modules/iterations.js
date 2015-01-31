'use strict';
(function(){
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;
    currentUser.isPendingAuth();

    iterationsRepository.setProjectId(projectId);

    this.iterations = iterationsCache.iterations;
    iterationsRepository.get(function(iterations, status, headers, config){
      iterationsCache.saveIterations(projectId,iterations);
      console.log("iterations: "+iterations);
      controller.iterations = iterations;
    });
 
    this.SaveIteration = function(){
      this.iteration.project_id = projectId; 
      
      iterationsRepository.saveIterations(this.iteration,function(data){ 




      });

      this.clearForm = function() {
        this.iteration.hours='';
        this.iteration.start='';
        this.iteration.invoice='';
      }
    };

  }]);


})();


