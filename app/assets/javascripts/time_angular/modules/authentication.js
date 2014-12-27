'use strict';
(function(){
  var app = angular.module('timeFrontendApp-authentication',['Devise','CacheStore'])

  app.controller('LoginController',['$scope','$location','Auth','CurrentUser', function($scope,$location,Auth,currentUser){
    var controller = this;
    this.signIn = function(){
      Auth.login(controller.user.credentials()).then(function(user) {
        currentUser.changeUser(user);
        currentUser.saveCache();
        $location('/projects')
      }, function(error) {

      });
    }
    this.user = new TimeApp.User();
    currentUser.checkAuth();

  }]);

})();
