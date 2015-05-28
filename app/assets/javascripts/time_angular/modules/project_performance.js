'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-performance',['CacheStore'])


  app.controller('PerformanceController',['$routeParams', '$location','CurrentUser','ProjectCache', 'CardsCache', 'CardRepository', 'TimeLoggerRepository', 'PerformanceRepository', function($routeParams, $location, currentUser, projectCache, cardsCache, cardRepository, timeLoggerRepository, performanceRepository){

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
    this.general = false;

    this.logOut = function(){
      localStorage.clear();
      window.location= "/log-in";
      location.reload();
    };
    this.toggleDisplay = function(timelog){
      timelog.fullRead = !timelog.fullRead;
    }

    var inizialize = function () {
      currentDate = new Date();
      var urlData = {};

      if($location.path()=='/performance/general')
        ctrl.general = true;

      ctrl.currentWeekStart = ctrl.calculateInterval(currentDate,1);
      ctrl.currentWeekEnd = ctrl.calculateInterval(currentDate,7);

      nextWeek = ctrl.calculateWeek(ctrl.currentWeekStart,1); 

      ctrl.nextWeekStart = ctrl.calculateInterval(nextWeek,1);
      ctrl.nextWeekEnd = ctrl.calculateInterval(nextWeek,7);

      dateStart = ctrl.dateFormat(ctrl.currentWeekStart);
      dateEnd = ctrl.dateFormat(ctrl.currentWeekEnd);

      ctrl.previousWeekStart = ctrl.calculateWeek(ctrl.currentWeekStart,-1);
      ctrl.previousWeekEnd = ctrl.calculateWeek(ctrl.currentWeekEnd,-1);

      urlData.date_1 = ctrl.dateFormat(ctrl.currentWeekStart); 
      urlData.date_2 = ctrl.dateFormat(ctrl.currentWeekEnd); 
      
      ctrl.getPerformance(urlData);
    } 


    this.changeNext = function(){
      this.totalWorked = 0;
      this.total = {};
      var urlData = {};

      this.previousWeekStart = this.currentWeekStart;
      this.previousWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.nextWeekStart;
      this.currentWeekEnd = this.nextWeekEnd;

      urlData.date_1 = this.dateFormat(this.currentWeekStart); 
      urlData.date_2 = this.dateFormat(this.currentWeekEnd);

      ctrl.getPerformance(urlData);

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      nextWeek = this.calculateWeek(this.currentWeekStart,1); 

      this.nextWeekStart = this.calculateInterval(nextWeek, 1);
      this.nextWeekEnd = this.calculateInterval(nextWeek, 7);
    }

    this.changePrevious = function(){
      this.totalWorked = 0;
      this.total = {};
      var urlData = {};

      this.nextWeekStart = this.currentWeekStart;
      this.nextWeekEnd = this.currentWeekEnd;

      this.currentWeekStart = this.previousWeekStart;
      this.currentWeekEnd = this.previousWeekEnd;

      urlData.date_1 = this.dateFormat(this.currentWeekStart); 
      urlData.date_2 = this.dateFormat(this.currentWeekEnd);

      ctrl.getPerformance(urlData);

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      this.previousWeekStart = this.calculateWeek(this.currentWeekStart,-1);
      this.previousWeekEnd = this.calculateWeek(this.currentWeekEnd,-1);
    }

    this.getPerformance = function(urlData){
      this.total = {};
      this.totalWorked =0;

      if(!ctrl.general)
        urlData.project_id = projectId;

      ctrl.setUrlToShare(urlData);

      timeLoggerRepository.setPrefixToBackend();
      timeLoggerRepository.abstractUrlBuilder(urlData);

      timeLoggerRepository.get(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');

        for(var time in timesGrouped)
        {
          ctrl.sum(timesGrouped[time],time);
          if(ctrl.general)
            timesGrouped[time]= new TimeApp.FieldGrouper(timesGrouped[time]).group_by('project_name');
        }
        ctrl.projectsGroup = timesGrouped;
      });

    };

    this.setUrlToShare = function(urlData){
      timeLoggerRepository.setPrefixToShare();
      timeLoggerRepository.abstractUrlBuilder(urlData);
      ctrl.urlShare = timeLoggerRepository.route;
      ctrl.getShortUrl(ctrl.urlShare);
    };

    this.getShortUrl = function(url){
      var long_url = url;
      var login = "o_32g0fvedmb";
      var api_key = "R_00527cbbec5e4ac6afec3245e4a01039";

      $.getJSON("https://api-ssl.bitly.com/v3/shorten?callback=?", { 
          "format": "json",
          "apiKey": api_key,
          "login": login,
          "longUrl": long_url
        },
        function(response){
      if(response.status_code != 500){
        ctrl.urlShare = response.data.url;  
      }else{
        ctrl.urlShare = url;
      }
      ctrl.shortlink = true;  
        });
    }


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
      $('#'+timelog._id.$oid).removeClass("hide");
      this.timelog=timelog;
    };

    this.editTimelog = function() {
      $('#'+this.timelog._id.$oid).addClass("hide");
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
	
    this.sum = function(items,date){
      var sum = 0;

      for (var i = 0; i<items.length; i++){
      if(items[i].value_ajust == 0 || items[i].value_ajust == undefined || items[i].value_ajust == null){
        sum += items[i].time;
      }else{
      sum += items[i].time;
      }   
      }

      if(date){
        if(!this.total[date])
          this.total[date] = 0;
        
        this.total[date] += sum;
        this.totalWorked += sum;
      }

      return sum;
    };
	
	function cleanDate(date){
	  return date.substring(1, 10);
	}
	
	function useTime(log){
	  return (log.value_ajust == 0 || log.value_ajust === null || log.value_ajust === undefined);
	}

    inizialize();

  }]);
  
})();