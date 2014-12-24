'use strict';
(function(){
  var app = angular.module('timeFrontendApp-authentication',['Devise','CacheStore'])

  app.controller('LoginController',['$scope','Auth','CurrentUser', function($scope,Auth,currentUser){
    var controller = this;
    this.signIn = function(){
      Auth.login(controller.user.credentials()).then(function(user) {
        currentUser.changeUser(user);
        currentUser.saveCache();
      }, function(error) {
        // TO-DO show messages errors
      });
    }
    this.user = new TimeApp.User();
    currentUser.checkAuth();

  }]);

})();
