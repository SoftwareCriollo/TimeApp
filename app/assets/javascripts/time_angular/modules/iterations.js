'use strict';
(function(){
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();
    var controller = this;
    console.log( $routeParams.projectId);
    this.projectId = $routeParams.projectId;

    iterationsRepository.setProjectId(this.projectId);

    this.iterations = iterationsCache.iterations;

    iterationsRepository.index(function(iterations, status, headers, config){
      iterationsCache.saveIterations(controller.projectId,iterations);
      console.log("iterations: "+iterations);
      controller.iterations = iterations;
    });
 
    this.SaveIteration = function(){
      this.iteration.project_id = controller.projectId; 
      iterationsRepository.saveIterations(controller.iteration, function() {
        controller.success=true;
        controller.clearForm();
      },
      this.error_callback = function() {
        controller.error=true;      
      });
    };

    this.clearForm = function(){
      location.refresh();
    }

  }]);


})();


