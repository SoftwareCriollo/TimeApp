'use strict';
(function(){
  var app = angular.module('timeFrontendApp-projects',['CacheStore'])

  app.controller('ProjectsController',['$http','CurrentUser','ProjectCache', function($http,currentUser,projectsCache){

    /* function to "log out" the user, clear all the local storage */
    this.logOut = function(){
      console.log('click log out');
      localStorage.clear();
      location.reload();
    };

    currentUser.isPendingAuth();

    var controller = this;

    this.projects = projectsCache.projects;
    $http.get('/api/projects')
      .success(function(projects, status, headers, config){
        projectsCache.saveProjects(projects);
        controller.projects = projects;
      });
    
    /* function to display the complete title of a project */
    this.hoverInProject = function(effect){
      $('.name-project-'+effect).css("white-space","normal");
      $('.name-project-'+effect).css("overflow","visible");
    };

    /* function to hide the complete title of a project "hover var effect" */
    this.hoverOutProject = function(effect){
      $('.name-project-'+effect).css("white-space","nowrap");
      $('.name-project-'+effect).css("overflow","hidden");
    };

    /* function to redirect and display cards of the selected project "var id" */
    this.showProject = function(id){
      window.location='#/projects/'+id+'/cards';
    };

  }]);

  app.controller('CardsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){
    /* function to "log out" the user, clear all the local storage */
    this.logOut = function(){
      console.log('click log out');
      localStorage.clear();
      location.reload();
    };

    currentUser.isPendingAuth();
    var controller = this;
    var projectId = $routeParams.projectId;
    this.project = projectCache.findProject(projectId);
    this.cards = cardsCache.loadCards(projectId);

    var url = '/api/projects/' + projectId + '/cards';
    $http.get(url)
      .success(function(cards, status, headers, config){
        cardsCache.saveCards(projectId,cards);
        controller.cards = cards;
      });
    /* function to add the selected card in an array, the array would be the "pre time log"  */
    this.task = []; // arry of the tasks to the time log
    this.tasks=function(idCard, nameCard){
      var dateCards = {}; // array to push date task
      dateCards.id = idCard;
      dateCards.name = nameCard;
      var add = 0;
      if(this.task!="") { // if the task's array isn't empty, push a new date or remove | else push a new task
        for (var i = 0; i < this.task.length; i++) {
          if (this.task[i].id==idCard)
            {
              add=add+1;
              var remove = i;
            }
        }
        if(add==0){this.task.push(dateCards);} // if not selected the same data, add date | else remove this
        else{this.task.splice(remove,1);}
        add=0;
      }
      else{ this.task.push(dateCards);}

      /* Conditions to show or hide the section "time log" to select a task */
      if(this.task!=""){
          $('.save-time-log').css("display","block");
          $('.title-time-log').css("display","inline-block");
          $('.underline-time-log').css("display","block");
        }
      else{
          $('.title-time-log').css("display","none");
          $('.save-time-log').css("display","none");
          $('.underline-time-log').css("display","none");
        }
    };

  }]);
})();

