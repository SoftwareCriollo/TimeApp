'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-performance',['CacheStore'])

  app.controller('GeneralPerformanceController',['$http','CurrentUser','ProjectCache', 'TimeLoggerRepository', 'UsersRepository', function($http,currentUser,projectsCache, timeLoggerRepository, usersRepository){

    currentUser.isPendingAuth();

    var controller = this; 
    this.total = {};
    this.totalWorked =0;
    this.end_date = new Date();
    this.start_date = new Date();
    this.timelog = undefined;

    this.projects = projectsCache.projects;
    
    usersRepository.getUsers(function(users, status, headers, config){
      controller.users = users;
    });
    
    this.edit = function(idPerformance){

      if(this.lastPerformance){
        $('.card-performance-' + this.lastPerformance).removeClass("selected"); //add class selected to performance by id, necessary to build the id
        $('.form-edit-perfotmance-' + this.lastPerformance).addClass("hide");
        $('.edit-performance-' + this.lastPerformance).removeClass("hide");
        $('.performance-' + this.lastPerformance).removeClass("margin-show-performance-edit");
      }

      $('.card-performance-' + idPerformance).addClass("selected"); //add class selected to performance by id, necessary to build the id
      $('.form-edit-perfotmance-' + idPerformance).removeClass("hide");
      $('.edit-performance-' + idPerformance).addClass("hide");
      $('.performance-' + idPerformance).addClass("margin-show-performance-edit");

      this.lastPerformance = idPerformance;
    };

    this.dateFormat = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    };

    this.SearchPerformance = function(){
      timeLoggerRepository.setParameters(this.dateFormat(this.start_date),this.dateFormat(this.end_date),this.project,this.user);
      
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
      console.log(timelog._id.$oid);
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

 

  app.controller('PerformanceController',['$http','$routeParams','CurrentUser','ProjectCache', function($http,$routeParams, currentUser,projectCache){

    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);

    this.edit = function(idPerformance){

      if(this.lastPerformance){
        $('.card-performance-' + this.lastPerformance).removeClass("selected"); //add class selected to performance by id, necessary to build the id
        $('.form-edit-perfotmance-' + this.lastPerformance).addClass("hide");
        $('.edit-performance-' + this.lastPerformance).removeClass("hide");
        $('.performance-' + this.lastPerformance).removeClass("margin-show-performance-edit");
      }

      $('.card-performance-' + idPerformance).addClass("selected"); //add class selected to performance by id, necessary to build the id
      $('.form-edit-perfotmance-' + idPerformance).removeClass("hide");
      $('.edit-performance-' + idPerformance).addClass("hide");
      $('.performance-' + idPerformance).addClass("margin-show-performance-edit");

      this.lastPerformance = idPerformance;
    };

  }]);


})();