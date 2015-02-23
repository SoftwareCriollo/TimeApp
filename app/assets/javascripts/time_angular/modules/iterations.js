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
      console.dir(iterations);
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

  app.controller('TimelogsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache', 'IterationsCache','TimeLoggerRepository', function(iterationsRepository,$routeParams, currentUser,projectCache, iterationsCache,timeLoggerRepository){
    currentUser.isPendingAuth();
  
    var controller = this;
    var iterationId = $routeParams.iterationId;

    var minDate = null;
    var maxDate = null;

    var currentDate = null;

    var nextWeek = null; 

    var dateStart = null;
    var dateEnd = null;

    this.timelogsGroup = [];
    this.timelogs = [];
    this.timelog = undefined;

    iterationsRepository.findIteration(iterationId, function(iteration, status, headers, config){
      controller.initialize(iteration);
      controller.project = projectCache.findProject(iteration.project_id);
    });



    this.initialize = function(iteration){
      this.iteration=iteration;
      minDate = new Date(iteration.start);
      maxDate = new Date(iteration.end_date || new Date());

      currentDate = minDate;

      this.currentWeekStart = this.calculateInterval(currentDate,1);
      this.currentWeekEnd = this.calculateInterval(currentDate,7);

      nextWeek = this.calculateWeek(this.currentWeekStart,1); 

      this.nextWeekStart = this.calculateInterval(nextWeek,1);
      this.nextWeekEnd = this.calculateInterval(nextWeek,7);

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      this.gettingEntries(dateStart,dateEnd);

      if(this.nextWeekStart < maxDate)
        this.showNext=true;

    }

    this.gettingEntries = function(dateStart,dateEnd){
      iterationsRepository.setDates(dateStart, dateEnd);
      
      iterationsRepository.entries(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.DateGrouper(timelogs).group_by('fecha');
        controller.timelogsGroup = timesGrouped;
        controller.timelogs = timelogs;
      });
    }

    this.dateFormat = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    };

    this.changeNext = function(){
      this.previousWeekStart = this.currentWeekStart;
      this.previousWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.nextWeekStart;
      this.currentWeekEnd = this.nextWeekEnd;

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      this.gettingEntries(dateStart,dateEnd);

      nextWeek = this.calculateWeek(this.currentWeekStart,1); 

      this.nextWeekStart = this.calculateInterval(nextWeek, 1);
      this.nextWeekEnd = this.calculateInterval(nextWeek, 7);
      this.showPrevious=true;

      if(this.nextWeekStart > maxDate)
        this.showNext=false;
    }

    this.changePrevious = function(){
      this.nextWeekStart = this.currentWeekStart;
      this.nextWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.previousWeekStart;
      this.currentWeekEnd = this.previousWeekEnd;

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      this.gettingEntries(dateStart,dateEnd);

      this.previousWeekStart = this.calculateWeek(this.currentWeekStart,-1);
      this.previousWeekEnd = this.calculateWeek(this.currentWeekEnd,-1);
      this.showNext = true;

      if(this.previousWeekStart < minDate)
        this.showPrevious=false;

    }

    this.calculateInterval = function(date, plus){
      return new Date(date.setDate(date.getDate() - date.getDay() + plus));
    }

    this.calculateWeek=function(date, sign){
      return new Date(date.getTime() + (7*sign) * 24 * 60 * 60 * 1000);
    }
    
    this.hasTimelogs = function(){
      return this.timelogs.length > 0
    };
    
    this.isEditing = function(timelog){
      return this.timelog == timelog;
    };


    this.editTimeEntry = function(timelog) {
      this.timelog = timelog;
    };

    this.editTimelog = function() {
      timeLoggerRepository.edit(this.timelog,function(){
        controller.gettingEntries();
        controller.timelog = undefined;
      });
    };

    this.total = function(timelogs){
      if (timelogs.length == 0)
        return 0;
      else{
        var value = 0;
        for (var i = timelogs.length - 1; i >= 0; i--) {
          value += timelogs[i].time;
        };
        return value;
      }
    }
  }]);

  app.filter('dateSuffix', function($filter) {
    var suffixes = ["th", "st", "nd", "rd"];
    return function(input) {
      var dtfilter = $filter('date')(new Date(input), 'MMMM dd');
      var day = parseInt(dtfilter.slice(-2));
      var relevantDigits = (day < 30) ? day % 20 : day % 30;
      var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
      return dtfilter.toUpperCase()+suffix;
    };
  });

  app.filter('ddSuffix', function($filter) {
    var suffixes = ["th", "st", "nd", "rd"];
    return function(input) {
      var dtfilter = $filter('date')(new Date(input), 'dd');
      var day = parseInt(dtfilter.slice(-2));
      var relevantDigits = (day < 30) ? day % 20 : day % 30;
      var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
      return dtfilter+suffix;
    };
  });

})();


