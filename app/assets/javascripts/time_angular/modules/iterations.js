'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    console.dir(this.project);
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

  app.controller('TimelogsController',['IterationsRepository','$routeParams','CurrentUser', 'IterationsCache','TimeLoggerRepository', function(iterationsRepository,$routeParams, currentUser, iterationsCache,timeLoggerRepository){
    currentUser.isPendingAuth();
  
    var controller = this;
    var iterationId = $routeParams.iterationId;

    iterationsRepository.setIterationId(iterationId);
    this.timelogsGroup = [];
    this.timelogs = [];
    this.timelog = undefined;
  
    this.gettingEntries = function(){
      iterationsRepository.entries(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.DateGrouper(timelogs).group_by('fecha');
        controller.timelogsGroup = timesGrouped;
        controller.timelogs = timelogs;
      });
    };

    this.gettingEntries();

    
    this.hasTimelogs = function(){
      console.log( this.timelogs.length );
      return this.timelogs.length > 0
    }
    
    this.isEditing = function(timelog){
      return this.timelog == timelog;
    }


    this.editTimeEntry = function(timelog) {
      this.timelog = timelog;
    }

    this.editTimelog = function() {
      timeLoggerRepository.edit(this.timelog,function(){
        controller.gettingEntries();
        controller.timelog = undefined;
      });
    }
    this.total = function(timelogs){
      return timelogs.reduce(function(prev, current){ return (prev.time + current.time); })
    }
  }]);
})();


