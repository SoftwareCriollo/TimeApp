'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-performance',['CacheStore'])

  app.controller('GeneralPerformanceController',['$http','CurrentUser','ProjectCache', 'TimeLoggerRepository', 'UsersRepository', function($http,currentUser,projectsCache, timeLoggerRepository, usersRepository){

    currentUser.isPendingAuth();

    var controller = this; 
    this.end_date = new Date();
    this.start_date = new Date();

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
        console.dir(timelogs);
        var timesGrouped = new TimeApp.DateGrouper(timelogs).group_by('fecha', 'project_name');
        console.dir(timesGrouped);
        controller.projectsGroup = timesGrouped;
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