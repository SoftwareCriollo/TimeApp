'use strict';
(function(){
  var app = angular.module('timeFrontendApp-projects',['CacheStore','Repository'])

  app.controller('ProjectsController',['ProjectRepository','CurrentUser','ProjectCache', function(projectRepository,currentUser,projectsCache){

    this.logOut = function(){ // function to "log out" the user, clear all the local storage
      localStorage.clear();
      location.reload();
    };

    currentUser.isPendingAuth();

    var controller = this;

    this.projects = projectsCache.projects;
    projectRepository.get(function(projects, status, headers, config){
      projectsCache.saveProjects(projects);
      controller.projects = projects;
    });

  }]);

  app.controller('CardsController',['CardRepository','$routeParams','CurrentUser','ProjectCache','CardsCache', function(cardRepository,$routeParams, currentUser,projectCache,cardsCache){

    var controller = this;
    var projectId = $routeParams.projectId;
    currentUser.isPendingAuth();

    this.project = projectCache.findProject(projectId);
    this.cards = cardsCache.loadCards(projectId);
    this.task = [];
    this.indexRemove = null;

    cardRepository.setProjectId(projectId);

    cardRepository.get(function(cards, status, headers, config){
      cardsCache.saveCards(projectId,cards);
      controller.cards = cards;
    });

    this.logOut = function(){ // function to "log out" the user, clear all the local storage
      localStorage.clear();
      location.reload();
    };

    /* add the selected card in an array, the array would be the "pre time log"  */
    this.isUnSelected = function(idCard, nameCard){ // function to validate is unselected a card
      for (var i = 0; i < this.task.length; i++) {
        if (this.task[i].id==idCard) {
            this.indexRemove = i;
            return true;
          }
        }
    };

    this.removeCard = function(idCard, nameCard){ //function to remove a card in arrat tasks
      this.task.splice(this.indexRemove,1);
      this.indexRemove = null;
    };

    this.addCard = function(idCard, nameCard){  // function to add card in array tasks
      var dateCards = {};
      dateCards.id = idCard;
      dateCards.name = nameCard;
      this.task.push(dateCards);
    };

    this.tasks = function(idCard, nameCard){ // function to do array time log
      if(this.task.length>0 && this.isUnSelected(idCard, nameCard)){
        this.removeCard(idCard, nameCard);
      }
      else if(this.task.length>0 && !this.isUnSelected(idCard, nameCard)){
        this.addCard(idCard, nameCard);
      }
      else{
        this.addCard(idCard, nameCard);
      }

      if(this.task.length>0){
        $('.section-time-log').removeClass('hide');
        $('.underline-division').removeClass('hide');
      }
      else{
        $('.section-time-log').addClass('hide');
        $('.underline-division').addClass('hide');
      }
    };
  /************************************************************************************/

  }]);


})();

