'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-performance',['CacheStore'])

  app.controller('GeneralPerformanceController',['CurrentUser','ProjectCache', 'CardsCache', 'CardRepository', 'TimeLoggerRepository', 'UsersRepository','$location', function(currentUser, projectsCache, cardsCache, cardRepository, timeLoggerRepository, usersRepository, $location){

    currentUser.isPendingAuth();

    var ctrl = this; 
    this.end_date = new Date();
    this.start_date = new Date();
    this.timelog = undefined;
    this.cards = {};
    this.totalWorked = 0;

    this.projects = projectsCache.projects;
    
    usersRepository.getUsers(function(users, status, headers, config){
      ctrl.users = users;
    });
    

    this.dateFormat = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    };

    this.setPerformance = function(){
      var urlData = [];

      urlData["date_1"] = this.dateFormat(this.start_date);
      urlData["date_2"] = this.dateFormat(this.end_date);
      urlData["project_id"] = this.project;
      urlData["user_id"] = this.user;
      
      this.getPerformance(urlData);
      this.setUrlToShare(urlData);
    };

    this.getPerformance = function(urlData){
      this.total = {};
      this.totalWorked =0;

      timeLoggerRepository.setPrefixToBackend();
      timeLoggerRepository.abstractUrlBuilder(urlData);

      timeLoggerRepository.get(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
        
        for(var time in timesGrouped)
        {
          ctrl.sum(timesGrouped[time],time);
          timesGrouped[time]= new TimeApp.FieldGrouper(timesGrouped[time]).group_by('project_name');
        }
        ctrl.projectsGroup = timesGrouped;
      });
    };

    this.setUrlToShare = function(urlData){
      timeLoggerRepository.setPrefixToShare();
      timeLoggerRepository.abstractUrlBuilder(urlData);
      ctrl.urlShare = timeLoggerRepository.route;
      this.getShortUrl(ctrl.urlShare);
    };

    this.getShortUrl = function(url){
      var long_url = url;
      var login = "o_32g0fvedmb";
      var api_key = "R_00527cbbec5e4ac6afec3245e4a01039";

      $.getJSON("http://api.bitly.com/v3/shorten?callback=?", { 
          "format": "json",
          "apiKey": api_key,
          "login": login,
          "longUrl": long_url
        },
        function(response){
          //ctrl.urlShare = response.data.url;
          ctrl.shortlink = true;
        });
    } 
    
    this.getUrlToShare = function(){
      var urlData = [];

      urlData["date_1"] = $location.search().date_1; 
      urlData["date_2"] = $location.search().date_2; 
      urlData["project_id"] = $location.search().project_id; 
      urlData["user_id"] = $location.search().user_id;

      ctrl.start_report = (urlData["date_1"]);
      ctrl.end_report = (urlData["date_2"]);

      this.getPerformance(urlData);
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
        ctrl.timelog = undefined;
      });
    };


    this.getListName = function(timelog,name){

      if(!this.cards[name])
      {
        this.cards[name]={};
        var projectId=timelog.project_id;
        cardRepository.setProjectId(projectId);
        cardRepository.get(function(cards, status, headers, config){
          cardsCache.saveCards(projectId,cards);
        });
      }

      if(!this.cards[name][timelog.task_id])
        this.cards[name][timelog.task_id]="";

      if(this.cards[name][timelog.task_id]=="")
      {
        var card = cardsCache.findCard(timelog.project_id,timelog.task_id);
        if(card)
          this.cards[name][timelog.task_id]=card.list_name;
        else
          this.cards[name][timelog.task_id]="DONE";
      }
    };

  }]);

 

  app.controller('PerformanceController',['$routeParams','CurrentUser','ProjectCache', 'CardsCache', 'TimeLoggerRepository', function($routeParams, currentUser, projectCache, cardsCache, timeLoggerRepository){

    currentUser.isPendingAuth();

    this.user=currentUser.getUser();
    var ctrl = this;
    var projectId = $routeParams.projectId;

    var currentDate = null;

    var nextWeek = null; 

    var dateStart = null;
    var dateEnd = null;
    
    this.project = projectCache.findProject(projectId);

    this.end_date = new Date();
    this.start_date = new Date();
    this.timelog = undefined;
    this.total = {};
    this.cards = {};
    this.totalWorked = 0;

    var inizialize = function () {
      currentDate = new Date();

      ctrl.currentWeekStart = ctrl.calculateInterval(currentDate,1);
      ctrl.currentWeekEnd = ctrl.calculateInterval(currentDate,7);

      nextWeek = ctrl.calculateWeek(ctrl.currentWeekStart,1); 

      ctrl.nextWeekStart = ctrl.calculateInterval(nextWeek,1);
      ctrl.nextWeekEnd = ctrl.calculateInterval(nextWeek,7);

      dateStart = ctrl.dateFormat(ctrl.currentWeekStart);
      dateEnd = ctrl.dateFormat(ctrl.currentWeekEnd);

      ctrl.previousWeekStart = ctrl.calculateWeek(ctrl.currentWeekStart,-1);
      ctrl.previousWeekEnd = ctrl.calculateWeek(ctrl.currentWeekEnd,-1);

      timeLoggerRepository.setParameters(ctrl.dateFormat(ctrl.currentWeekStart),ctrl.dateFormat(ctrl.currentWeekEnd),projectId,ctrl.user.id);

      timeLoggerRepository.get(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
        ctrl.projectsGroup = timesGrouped;
      });
    } 

    this.changeNext = function(){
      this.totalWorked = 0;
      this.total = {};
      this.previousWeekStart = this.currentWeekStart;
      this.previousWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.nextWeekStart;
      this.currentWeekEnd = this.nextWeekEnd;

      timeLoggerRepository.setParameters(this.dateFormat(this.currentWeekStart),this.dateFormat(this.currentWeekEnd),projectId,this.user.id);

      timeLoggerRepository.get(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
        ctrl.projectsGroup = timesGrouped;
      });

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      nextWeek = this.calculateWeek(this.currentWeekStart,1); 

      this.nextWeekStart = this.calculateInterval(nextWeek, 1);
      this.nextWeekEnd = this.calculateInterval(nextWeek, 7);
    }

    this.changePrevious = function(){
      this.totalWorked = 0;
      this.total = {};
      this.nextWeekStart = this.currentWeekStart;
      this.nextWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.previousWeekStart;
      this.currentWeekEnd = this.previousWeekEnd;

      timeLoggerRepository.setParameters(this.dateFormat(this.currentWeekStart),this.dateFormat(this.currentWeekEnd),projectId,this.user.id);

      timeLoggerRepository.get(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
        ctrl.projectsGroup = timesGrouped;
      });

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      this.previousWeekStart = this.calculateWeek(this.currentWeekStart,-1);
      this.previousWeekEnd = this.calculateWeek(this.currentWeekEnd,-1);
    }

    this.sum = function(item,date){
      if(date){
        if(!this.total[date])
          this.total[date] = 0;
        
        this.total[date] += item.time;
        this.totalWorked += item.time;
      }
    };

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
        ctrl.timelog = undefined;
      });
    };

    this.getListName = function(timelog){
      if(!this.cards[timelog.task_id])
        this.cards[timelog.task_id]="";

      if(this.cards[timelog.task_id]=="")
      {
        var card = cardsCache.findCard(timelog.project_id,timelog.task_id);
        if(card)
          this.cards[timelog.task_id]=card.list_name;
        else
          this.cards[timelog.task_id]="DONE";
      }
    };

    inizialize();

  }]);


})();