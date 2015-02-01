'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    this.iteration = new TimeApp.Iteration({project_id: this.project.id});

    iterationsRepository.setProjectId(this.project.id);
    this.iterations = [];

    iterationsRepository.index(function(iterations, status, headers, config){
      controller.iterations = iterations;
    });
 
    this.SaveIteration = function(){
      this.iteration.project_id = controller.projectId; 
      iterationsRepository.saveIterations(controller.iteration.toJsonToServer(), function() {
        controller.clearForm();
      },
      function() {
        controller.error=true;      
      });
    };

    this.clearForm = function(){
      location.reload();
    }

  }]);


})();


