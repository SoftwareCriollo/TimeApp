'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-performance',['CacheStore'])

  app.controller('GeneralPerformanceController',['$http','CurrentUser','ProjectCache', 'TimeLoggerRepository', 'UsersRepository', function($http,currentUser,projectsCache, timeLoggerRepository, usersRepository){

    currentUser.isPendingAuth();

    var controller = this; 
    this.end_date = new Date();
    this.start_date = new Date();
    this.timelog = undefined;

    this.projects = projectsCache.projects;
    
    usersRepository.getUsers(function(users, status, headers, config){
      controller.users = users;
    });
    

    this.dateFormat = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    };

    this.SearchPerformance = function(){
      this.total = {};
      this.totalWorked =0;
      timeLoggerRepository.setParameters(this.dateFormat(this.start_date),this.dateFormat(this.end_date),this.project,"");
      
      timeLoggerRepository.get(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
        
        for(var time in timesGrouped)
        {
          controller.sum(timesGrouped[time],time);
          timesGrouped[time]= new TimeApp.FieldGrouper(timesGrouped[time]).group_by('project_name');
        }
        console.dir(timesGrouped);
        controller.projectsGroup = timesGrouped;
      });
    };

    this.sum = function(items,date){
      var sum = 0;

      for (var i = 0; i<items.length; i++){
        sum += items[i].time;
      }

      if(date){
        if(!this.total[date])
          this.total[date] = 0;
        
        this.total[date] += sum;
        this.totalWorked += sum;
      }

      return sum;
    };

    this.isEditing = function(timelog){
      return this.timelog == timelog;
    };

    this.editTimeEntry = function(timelog) {
      angular.element( document.getElementById(timelog._id.$oid ) ).removeClass("hide");
      this.timelog=timelog;
    };

    this.editTimelog = function() {
      angular.element( document.getElementById(this.timelog._id.$oid ) ).addClass("hide");
      timeLoggerRepository.edit(this.timelog,function(){
        controller.timelog = undefined;
      });
    };

  }]);

 

  app.controller('PerformanceController',['$http','$routeParams','CurrentUser','ProjectCache', 'TimeLoggerRepository', function($http,$routeParams, currentUser,projectCache, timeLoggerRepository){

    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    var minDate = null;
    var maxDate = null;

    var currentDate = null;

    var nextWeek = null; 

    var dateStart = null;
    var dateEnd = null;
    
    this.project = projectCache.findProject(projectId);

    this.end_date = new Date();
    this.start_date = new Date();
    this.timelog = undefined;

    this.calculateInterval = function(date, plus){
      return new Date(date.setDate(date.getDate() - date.getDay() + plus));
    }

    this.calculateWeek=function(date, sign){
      return new Date(date.getTime() + (7*sign) * 24 * 60 * 60 * 1000);
    }

    this.dateFormat = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    };


      minDate = new Date();
      maxDate = new Date();

      currentDate = new Date();

      this.currentWeekStart = this.calculateInterval(currentDate,1);
      this.currentWeekEnd = this.calculateInterval(currentDate,7);

      nextWeek = this.calculateWeek(this.currentWeekStart,1); 

      this.nextWeekStart = this.calculateInterval(nextWeek,1);
      this.nextWeekEnd = this.calculateInterval(nextWeek,7);

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

//      if(this.nextWeekStart < maxDate)
        this.showNext=true;

    timeLoggerRepository.setParameters(this.dateFormat(this.currentWeekStart),this.dateFormat(this.currentWeekEnd),projectId,this.user);


    timeLoggerRepository.get(function(timelogs, status, headers, config){
      console.log(timelogs);
      var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
      
      console.dir(timesGrouped);
      controller.projectsGroup = timesGrouped;
    });

  this.changeNext = function(){
      this.previousWeekStart = this.currentWeekStart;
      this.previousWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.nextWeekStart;
      this.currentWeekEnd = this.nextWeekEnd;

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      nextWeek = this.calculateWeek(this.currentWeekStart,1); 

      this.nextWeekStart = this.calculateInterval(nextWeek, 1);
      this.nextWeekEnd = this.calculateInterval(nextWeek, 7);
      this.showPrevious=true;

      //if(this.nextWeekStart > maxDate)
       // this.showNext=false;
    }

    this.changePrevious = function(){
      this.nextWeekStart = this.currentWeekStart;
      this.nextWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.previousWeekStart;
      this.currentWeekEnd = this.previousWeekEnd;

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      this.previousWeekStart = this.calculateWeek(this.currentWeekStart,-1);
      this.previousWeekEnd = this.calculateWeek(this.currentWeekEnd,-1);
      this.showNext = true;

      //if(this.previousWeekStart < minDate)
       // this.showPrevious=false;

    }

  }]);


})();