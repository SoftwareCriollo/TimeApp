'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-performance',['CacheStore'])


  app.controller('PerformanceController',['$routeParams','CurrentUser','ProjectCache', 'CardsCache', 'TimeLoggerRepository', 'PerformanceRepository', function($routeParams, currentUser, projectCache, cardsCache, timeLoggerRepository, performanceRepository){

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

      if (projectId !== undefined && projectId !== null){
        urlData.project_id = projectId; 
      }

      timeLoggerRepository.setPrefixToBackend();
      timeLoggerRepository.abstractUrlBuilder(urlData);

      timeLoggerRepository.get(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
        ctrl.projectsGroup = timesGrouped;
      });
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

      if (projectId !== undefined && projectId !== null){
        urlData.project_id = projectId; 
      } 

      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      nextWeek = this.calculateWeek(this.currentWeekStart,1); 

      this.nextWeekStart = this.calculateInterval(nextWeek, 1);
      this.nextWeekEnd = this.calculateInterval(nextWeek, 7);
	  
	  this.loadCards(projectId);
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

      if (projectId !== undefined && projectId !== null){
        urlData.project_id = projectId; 
      } 
	  
      dateStart = this.dateFormat(this.currentWeekStart);
      dateEnd = this.dateFormat(this.currentWeekEnd);

      this.previousWeekStart = this.calculateWeek(this.currentWeekStart,-1);
      this.previousWeekEnd = this.calculateWeek(this.currentWeekEnd,-1);
	  
	  this.loadCards(projectId);
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

    this.getListName = function(timelog){
    };
	
	
	this.loadCards = function(project_id){
	  var maincards = []
	  var total = {}
	  total["all"] = 0
	  var cachedCards = cardsCache.getCardsByProjectId(project_id)
	  angular.forEach(cachedCards, function(card, key) {
		 if (dateStart < card.due && card.due < dateEnd) {
		   
		   card["hours"] = 0.0;
		   card["due"] = cleanDate(card["due"]);
		   performanceRepository.setCard(project_id, card.id, dateStart, dateEnd)
		   performanceRepository.get(function(timelogs){
			   angular.forEach(timelogs, function(log, key){
				 if(useTime(log)){
				   card["hours"] += parseFloat(log.time);
				 }else{
			   	   card["hours"] += parseFloat(log.value_ajust);
				 }
			   });
	           if(!total[card.due])
	             total[card.due] = 0;
	           total[card.due] += card["hours"];
	           total["all"] += card["hours"];
		   });
		   
		   this.push(card);

		 }
	  }, maincards);
	  this.total = total;
	  this.totalWorked = total["all"];
	  return this.cards = maincards;
	}
	
	function cleanDate(date){
	  return date.substring(1, 10);
	}
	
	function useTime(log){
	  return (log.value_ajust == 0 || log.value_ajust === null || log.value_ajust === undefined);
	}

    inizialize();

  }]);
  
})();