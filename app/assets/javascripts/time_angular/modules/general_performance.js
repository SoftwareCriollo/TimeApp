'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-generalPerformance',['CacheStore'])

  app.controller('GeneralPerformanceController',['CurrentUser', 'ProjectCache', 'ClientsCache', 'CardsCache', 'CardRepository', 'TimeLoggerRepository', 'UsersRepository', 'ClientsRepository', 'ProjectRepository', '$location', function(currentUser, projectsCache, clientsCache, cardsCache, cardRepository, timeLoggerRepository, usersRepository, clientsRepository, projectRepository, $location){

    if (/report/.test(window.location)==false){
      currentUser.isPendingAuth();
    }else{
      $('div.header a').removeAttr('href');
    }
    
    var ctrl = this; 
    var currentDate = null;
    var nextWeek = null; 
    var dateStart = null;
    var dateEnd = null;

    this.users = {};
    this.commits = {};
    this.clients = {};
    this.projects = {};

    this.end_date = new Date();
    this.start_date = new Date();
    this.timelog = {};
    this.cards = {};
    this.totalWorked = 0;
	  this.urlShare = ""

    this.projects = projectsCache.projects;

    this.clients = clientsCache.clients;

    usersRepository.getUsers(function(users, status, headers, config){
      ctrl.users = users;
    });

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

      ctrl.getPerformance(urlData);
    } 

    this.changeNext = function(){
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


    this.calculateInterval = function(date, plus){
      return new Date(date.setDate(date.getDate() - date.getDay() + plus));
    }

    this.calculateWeek=function(date, sign){
      return new Date(date.getTime() + (7*sign) * 24 * 60 * 60 * 1000);
    }

    this.toggleDisplay = function(timelog){
      timelog.fullRead = !timelog.fullRead;
    };

    this.logOut = function(){
      localStorage.clear();
      window.location= "/log-in";
      location.reload();
    };
    
    this.dateFormat = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    };

    this.setPerformance = function(){
      var urlData = {};

      urlData.date_1 = this.dateFormat(this.start_date);
      urlData.date_2 = this.dateFormat(this.end_date);

      if (this.project !== undefined && this.project !== null){
        urlData.project_id = this.project;
      }

      if (this.user !== undefined && this.user !== null){
        urlData.user_id = this.user;
      }

      ctrl.runPeformance(urlData); 
    };

    this.runPeformance = function(urlData){
      //ctrl.initGitData(urlData);
	    ctrl.setUrlToShare(urlData); 
      ctrl.getPerformance(urlData);
      
    };

    this.initGitData = function(urlData){
      var gitData = {}; 
      gitData = {
        allUsers: ctrl.filterUsers(ctrl.users, urlData),
        allClients: ctrl.filterClients(ctrl.clients, urlData),
      };
      ctrl.getTypeRepository(gitData);
    }

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
    
    this.getDataFromUrl = function(){
      var urlData = {};

      urlData.date_1 = $location.search().date_1; 
      urlData.date_2 = $location.search().date_2; 

      var project_id = $location.search().project_id;
      var user_id = $location.search().user_id;

      if (project_id !== undefined && project_id !== null){
        urlData.project_id = project_id; 
      }

      if (user_id !== undefined && user_id !== null){
        urlData.user_id = user_id;
        
      }

      ctrl.getDataFromServer(urlData);
      ctrl.setTitleReport(urlData); 
    };

    this.setTitleReport = function(urlData){
      ctrl.start_date = urlData.date_1;
      ctrl.end_date = urlData.date_2;

      ctrl.setTitleReport = '';

      if (urlData.project_id !== undefined && urlData.project_id !== null){
        projectRepository.findProjectByName(urlData.project_id, function(projectName, status, headers, config){
          ctrl.setTitleReport += projectName+'  '
        });
      }else{
          ctrl.setTitleReport += 'All Projects  '
      }

      if (urlData.user_id !== undefined && urlData.user_id !== null){
        usersRepository.findUser(urlData.user_id, function(user, status, headers, config){
          ctrl.setTitleReport += ''
        });
      }else{
        ctrl.setTitleReport += ''
      }
    }

    this.getDataFromServer = function(urlData){

      ctrl.getProjectsFromServer();

      usersRepository.getUsers(function(users, status, headers, config){
        var usersData = ctrl.filterUsers(users, urlData)

        clientsRepository.findAllClients(function(clients, status, headers, config){
          var clientsData = ctrl.filterClients(clients, urlData)

          var gitData = {
            allUsers: usersData,
            allClients: clientsData,
          };

          ctrl.getPerformance(urlData);
          ctrl.getTypeRepository(gitData);
        });

      });

    };

    this.filterUsers = function(users, urlData){
      if (urlData.user_id){
        var user = {};
        $.each(users, function(key, value) {
          if (urlData.user_id == value._id.$oid){
            user = value;
          }
        });
        return [user];
      }else{
        return users;
      }  
    };

    this.filterClients = function(clients, urlData){
      if (urlData.project_id){
        var client = {};
        $.each(clients, function(key, value) {
          if (urlData.project_id == value.project_id){
            client = value; 
          }
        });
        return [client];
      }else{
        return clients;
      }
    };

    this.getProjectsFromServer = function(urlData){
      projectRepository.get(function(projects, status, headers, config){
        ctrl.projects = projects;
      });
    };

    this.getTypeRepository = function(gitData){
      var gitRepository = [];
      var gitRoute = '';
      var routeSize = '';
      var gitLabRoute = '';
      var gitLabPrefix = '';
      var gitLabProjectId = '';
      /*
      $.each(gitData.allClients, function(clientKey, clientValue) {
        if (clientValue.git){
          gitRoute = clientValue.git;
          routeSize = gitRoute.indexOf("com");
          gitLabRoute = gitRoute.slice(0, routeSize+3);
          gitLabPrefix = gitRoute.slice(routeSize+4);
          gitLabProjectId = ctrl.getProjectIdFromGitLab(gitLabRoute, gitLabPrefix);

          gitRepository.push({
            projectId: clientValue.project_id,
            gitLabRepo: gitRoute.replace('.git',''),
            gitLabRoute: gitLabRoute,
            gitLabProjectId: gitLabProjectId,
          });
        }
      });
      */
      //this.getDataFromGitLab(gitRepository, gitData);
    };

    this.getProjectIdFromGitLab = function(gitLabRoute, gitLabPrefix){
      var url = gitLabRoute+"/api/v3/projects?private_token=zsXXHi8sUR_RzJDvp6db"
      var projectId = 0;

      $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
          $.each(data, function(key, value) {
            if (value.path_with_namespace+'.git' == gitLabPrefix){
              projectId = value.id; 
            }
          });
        } 
      });

      return projectId;
    };

    this.getDataFromGitLab = function(gitRepository, gitData){
      var commitData = [];
      var route = '';

      $.each(gitRepository, function(repoKey, repoValue) {
        var url = repoValue.gitLabRoute+'/api/v3/projects/'+ repoValue.gitLabProjectId + "/repository/commits?private_token=zsXXHi8sUR_RzJDvp6db"
       
        $.get(url, {per_page: 50000}, function(data, status){
          $.each(data, function(gitKey, gitValue) {
            $.each(gitData.allUsers, function(userKey, userValue) {
              if (userValue.email == gitValue.author_email) {
                route = repoValue.gitLabRepo+'/commit/'+gitValue.id;
                commitData.push({
                  projectId: repoValue.projectId,
                  route: route,
                  title: gitValue.title,
                  date: ctrl.getDate(gitValue.created_at),
                });
              }
            });
          });
        });

      });
      ctrl.commits = commitData;
    };

    this.getDate = function(data){
      var date = data.slice(0, 10);
      return date;    
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
        console.log('totalWorked: '+this.totalWorked);
      }

      return sum;
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

    inizialize();

  }]);

})();