(function(){
  var TimeApp = window.TimeApp;
  var CacheStoreModule = angular.module('CacheStore', []);

  CacheStoreModule.config(['$provide', function($provide) {
    $provide.factory('ProjectCache',[function() {
      this.loadProjects = function(){
        return loadJsonCache('projects') || [];
      };

      this.saveProjects = function(new_projects){
        saveJsonCache('projects',new_projects);
      };      
      this.findProject = function(project_id){
        this.projects = this.loadProjects();
        for (var i = this.projects.length - 1; i >= 0; i--) {
          project = this.projects[i];
          if(project.id == project_id)
            return project;
        };
      };
      this.projects = this.loadProjects();    
      return this;
    }]);

    $provide.factory('IterationsCache',[function() {
      this.loadIterations = function(project_id){
        return loadJsonCache(project_id+'_iterarions') || [];
      };

      this.saveIterations = function(project_id, new_iterations){
        saveJsonCache(project_id+'_iterations',new_iterations);
      };

      return this;
    }]);

    $provide.factory('CardsCache',[function() {
      this.loadCards = function(project_id){
        return loadJsonCache(project_id+'_cards') || [];
      };

      this.saveCards = function(project_id, new_cards){
        saveJsonCache(project_id+'_cards',new_cards);
      };

      this.findCard = function(project_id,card_id){
        this.cards = this.loadCards(project_id);
        for (var i = this.cards.length - 1; i >= 0; i--) {
          card = this.cards[i];
          if(card.id == card_id)
            return card;
        };
      };

      return this;
    }]);

    $provide.factory('ClientsCache',[function() {
      this.loadClients = function(){
        return loadJsonCache('clients') || [];
      };

      this.saveClients = function(new_clients){
        saveJsonCache('clients',new_clients);
      };      
      this.findClient = function(client_id){
        this.clients = this.loadClients();
        for (var i = this.clients.length - 1; i >= 0; i--) {
          client = this.clients[i];
          if(client.id == client_id)
            return client;
        };
      };
      this.clients = this.loadClients();    
      return this;
    }]);

    $provide.factory('CurrentUser',["$location",function($location) {
      var currentUser;
      this.id= function(){
        currentUser.id;
      };

      this.isAuthenticated = function(){
        return currentUser.token_authentication != undefined;
      };
      this.changeUser = function(user){
        currentUser = user;
        $('meta[name="Token"]').attr('content',user.token_authentication);
      };
      this.token = function(){
        return currentUser.token_authentication;
      }
      this.saveCache = function(){
        saveJsonCache('currentUser',currentUser);
      };

      this.checkAuth = function(){      
        if(this.isAuthenticated()){
          $location.path('/');
        }
      }
      this.isPendingAuth = function(){      
        if( !this.isAuthenticated()){
          $location.path('/log-in');
        }
      }
      this.getUser = function(){
        return currentUser;
      }
      if( existCache("currentUser") )
        currentUser = new TimeApp.User( loadJsonCache("currentUser") );      
      else
        currentUser = new TimeApp.User();

      $('meta[name="Token"]').attr('content',currentUser.token_authentication);
      return this;
    }]);

  }]);

  var saveJsonCache = function(name,obj){
    localStorage[name] = JSON.stringify(obj);
  };

  var loadJsonCache = function(name){
    if(localStorage[name])
      return JSON.parse(localStorage[name]);
    else
      return undefined;
  };

  var existCache = function(name){
    return localStorage[name] != undefined
  };
})();
