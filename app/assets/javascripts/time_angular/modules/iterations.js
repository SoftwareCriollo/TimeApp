'use strict';
(function(){
  var app = angular.module('timeFrontendApp-iterations',['CacheStore'])

  app.controller('IterationsController',['$http','$routeParams','CurrentUser','ProjectCache','CardsCache', function($http,$routeParams, currentUser,projectCache,cardsCache){

    currentUser.isPendingAuth();

    var controller = this;
    var projectId = $routeParams.projectId;

    /* controller in construction */

  }]);


})();


