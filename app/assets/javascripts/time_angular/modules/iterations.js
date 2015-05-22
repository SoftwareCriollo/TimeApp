'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-iterations',['CacheStore','Repository'])

  app.controller('IterationsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache','IterationsCache', function(iterationsRepository,$routeParams, currentUser,projectCache,iterationsCache){
    currentUser.isPendingAuth();

    var ctrl = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);
    this.iteration = new TimeApp.Iteration({project_id: projectId});
    this.iterationEdit = new TimeApp.Iteration({project_id: projectId});

    iterationsRepository.setProjectId(this.project.id);
    this.iterations = [];

    iterationsRepository.index(function(iterations, status, headers, config){
      ctrl.iterations = iterations;
    });

    this.SaveIteration = function(){
      iterationsRepository.saveIterations(ctrl.iteration.toJsonToServer(), function() {
        ctrl.clearForm();
      },
      function() {
        ctrl.error=true;      
      });
    };

    this.isEditing = function(iteration){
      return this.iterationEdit == iteration;
    };

    this.editTimeIteration = function(iteration) {
      $('#'+iteration._id.$oid ).find('#edit').removeClass("hide");
      $('#'+iteration._id.$oid).children(':first').hide();
      if(typeof iteration.start == "string"){
        var parts = iteration.start.split('-') ? iteration.start.split('-') : null;
        iteration.start = parts ? new Date(parts[0], parts[1]-1, parts[2]) : iteration.start;
      }
      this.iterationEdit=iteration;
    };

    this.editIteration = function() {
      $('#'+this.iterationEdit._id.$oid ).find('#edit').addClass("hide");
      $('#'+this.iterationEdit._id.$oid).children(':first').show();
      iterationsRepository.edit(this.iterationEdit,function(){
        ctrl.iterationEdit = undefined;
      });
    };

    this.clearForm = function(){
      location.reload();
    }

  }]);

  app.controller('TimelogsController',['IterationsRepository','$routeParams','CurrentUser','ProjectCache', 'IterationsCache','TimeLoggerRepository','$scope' ,'$rootScope', '$location', 'ProjectRepository', function(iterationsRepository,$routeParams, currentUser,projectCache, iterationsCache,timeLoggerRepository,$scope,$rootScope, $location, projectRepository){
    if (/report/.test(window.location)==false){
      currentUser.isPendingAuth();
    }
  
    var ctrl = this;
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
      ctrl.initialize(iteration);
    });

    this.initialize = function(iteration){
      this.iteration=iteration;
	  var projectId = iteration.project_id;
	  this.project = projectCache.findProject(projectId);
	  
	  if(this.project){
		  ctrl.projectName = project.name;
	  }else{
      projectRepository.findProjectByName(projectId, function(pName, status, headers, config){
        ctrl.projectName = pName;
      });	
	  }
	  
      this.currentWeekEnd = $rootScope.UTCDate(iteration.end_date);
      this.currentWeekStart = $rootScope.UTCDate(iteration.start);

      this.gettingEntries(dateStart,dateEnd);

    }

    this.gettingEntries = function(dateStart, dateEnd){
      iterationsRepository.setParameters(dateStart, dateEnd);

      iterationsRepository.entries(function(timelogs, status, headers, config){
        var timesGrouped = new TimeApp.FieldGrouper(timelogs).group_by('fecha');
        ctrl.timelogsGroup = timesGrouped;
        ctrl.timelogs = timelogs;
      });

      this.setUrlToShare(dateStart, dateEnd);
    }

    this.setUrlToShare = function(dateStart, dateEnd){
      iterationsRepository.setParametersToShare(dateStart, dateEnd);
      $scope.urlShare = "";
      this.getShortUrl(iterationsRepository.route);
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
          $scope.urlShare = response.data.url;  
    			if(response.status_code != 500){
            $scope.urlShare = response.data.url;	
            console.log('url: '+$scope.urlShare);
    			}else{
            $scope.urlShare = url;	
    			}
        });
    }

    this.getUrlToShare = function(){
      var dateStart = $location.search().date_1; 
      var dateEnd = $location.search().date_2; 

      this.gettingEntries(dateStart, dateEnd);
    };

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

      if(this.nextWeekStart >= maxDate)
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

      if(this.previousWeekStart <= minDate)
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
      $('#'+timelog._id.$oid ).removeClass("hide");
      this.timelog=timelog;
    };

    this.editTimelog = function() {
      $('#'+this.timelog._id.$oid).addClass("hide");
      timeLoggerRepository.edit(this.timelog,function(){
        ctrl.gettingEntries();
        ctrl.timelog = undefined;
      });
    };

    this.total = function(timelogs){
      if (timelogs.length == 0)
        return 0;
      else{
        var value = 0;
        for (var i = timelogs.length - 1; i >= 0; i--) {
		  value += timelogs[i].time;
		  //if(timelogs[i].value_ajust == 0 || timelogs[i].value_ajust == undefined || timelogs[i].value_ajust == null){
		  //	
		  //}else{
		  //	value += timelogs[i].value_ajust;
		  //}
        };
        return value;
      }
    }
  }]);

  app.run(function($rootScope) {
    $rootScope.UTCDate = function(date) {
      var utcDate = new Date(date);
      return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
    };
  });


})();


