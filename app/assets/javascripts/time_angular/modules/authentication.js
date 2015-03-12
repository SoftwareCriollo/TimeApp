'use strict';
(function(){
  var TimeApp = window.TimeApp;
  var app = angular.module('timeFrontendApp-authentication',['Devise','CacheStore'])

  app.controller('LoginController',['$scope','$routeParams','$location','Auth','CurrentUser', function($scope,$routeParams,$location,Auth,currentUser){
    var controller = this;
    this.sended = $routeParams.sended;
    this.signIn = function(){
      Auth.login(controller.user.credentials()).then(function(user) {
        currentUser.changeUser(user);
        currentUser.saveCache();
        $location.path('/projects')
      }, function(error) {
          $scope.alerts = { message: 'The email or password you entered is incorrect.', success: false, error: true };
    });
    }
    this.user = new TimeApp.User();
    currentUser.checkAuth();
  }]);

  app.controller('ForgotController',['$scope','$location','Auth','CurrentUser', function($scope,$location,Auth){
    var controller = this;
    this.user = new TimeApp.User();
    currentUser.checkAuth();
  }]);

})();
