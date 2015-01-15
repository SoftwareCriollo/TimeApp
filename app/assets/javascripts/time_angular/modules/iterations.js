'use strict';
(function(){
  var app = angular.module('timeFrontendApp-iterations',['CacheStore'])

  app.controller('IterationsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){

    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    this.project = projectCache.findProject(projectId);

    this.editTimeEntry = function(entry){

      if(this.lastEntry){
        $('.card-iterarion-' + this.lastEntry).removeClass("selected"); //add class selected to card by entry (entry's the id), necessary to build the id
        $('.entry-time-' + this.lastEntry).addClass("hide");
        $('.edit-entry-' + this.lastEntry).removeClass("hide");
        $('.entry-time-iterations-' + this.lastEntry).removeClass("margin-show-entry-edit");
      }

      $('.card-iterarion-' + entry).addClass("selected"); //add class selected to card by entry (entry's the id), necessary to build the id
      $('.entry-time-' + entry).removeClass("hide");
      $('.edit-entry-' + entry).addClass("hide");
      $('.entry-time-iterations-' + entry).addClass("margin-show-entry-edit");


      this.lastEntry = entry;
    };



  }]);


})();


