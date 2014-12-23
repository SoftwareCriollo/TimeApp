'use strict';
(function(){
  var app = time_angular.module('timeFrontendApp-login',['Devise'])
  app.config(function(AuthProvider) {
    AuthProvider.loginPath('/users/sign_in.json');
    AuthProvider.loginMethod('POST');
    AuthProvider.resourceName('user');
  });
  app.controller('LoginController',  function(){
    this.user = new TimeApp.User();

    Auth.login(this.user.credentials()).then(function(user) {
      console.log(user);
    }, function(error) {
      console.log(error);
    });

    $scope.$on('devise:login', function(event, currentUser) {
      console.log("Should redirecto into projects");
    });

    $scope.$on('devise:new-session', function(event, currentUser) {
      console.log("mmmmmm we'll see");
    });
  });

})();
