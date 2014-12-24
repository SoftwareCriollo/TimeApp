'use strict';
(function(){
  var app = angular.module('timeFrontendApp-authentication',['Devise'])

  app.controller('LoginController',['$scope','Auth', function($scope,Auth){
    var controller = this;
    var scope = $scope;
    this.user = new TimeApp.User({email: "test@email.com",password:"123qweasd"});
    
    this.signIn = function(){
      Auth.login(controller.user.credentials()).then(function(user) {

      }, function(error) {
        console.log(error);
      });
    }

    $scope.$on('devise:login', function(event, currentUser) {

    });

    $scope.$on('devise:new-session', function(event, currentUser) {

    });
  }]);

})();
