'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    this.iteration = new TimeApp.Iteration({project_id: projectId});

    iterationsRepository.setProjectId(this.project.id);
    this.iterations = [];

    iterationsRepository.index(function(iterations, status, headers, config){
      controller.iterations = iterations;
    });

    this.SaveIteration = function(){
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

  app.controller('TimelogController',['TimeLoggerRepository','$routeParams','CurrentUser','ProjectCache', function(timeloggerRepository,$routeParams, currentUser,projectCache){
    currentUser.isPendingAuth();
  
    var controller = this;
    var projectId = $routeParams.projectId;
    var iterarionId = 'ObjectId("54cafbc57261660d1a0b0000")';
  
    this.project = projectCache.findProject(projectId);

    timeloggerRepository.setProjectId(projectId);
    timeloggerRepository.setIterationId(iterarionId);
    this.timelogs = [];
  
    timeloggerRepository.index(function(timelogs, status, headers, config){
      controller.timelogs = timelogs;
    });
   
   
  }]);


})();


