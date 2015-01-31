'use strict';
(function(){
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();
    var controller = this;
    var projectId = $routeParams.projectId;

    iterationsRepository.setProjectId(projectId);

    this.iterations = iterationsCache.iterations;
    iterationsRepository.get(function(iterations, status, headers, config){
      iterationsCache.saveIterations(projectId,iterations);
      console.log("iterations: "+iterations);
      controller.iterations = iterations;
    });
 
    this.SaveIteration = function(){
      this.iteration.project_id = projectId; 
      
      iterationsRepository.saveIterations(this.iteration, this.success_callback = function() {
        alert('The iteration was registrated successfully.');

      },
      this.error_callback = function() {
      
      });
    };

    this.clearForm = function(){
      this.iteration = new TimeApp.iteration( {project_id: project_id}); 
    }

  }]);


})();


