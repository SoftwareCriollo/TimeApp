(function(){
  window.TimeApp =  window.TimeApp || {};
  var User = function(attributes){
    attributes = attributes || {} 
    this.email = attributes.email;
    this.password = attributes.password;
    this.token_authentication = attributes.token_authentication;
    this.name = attributes.name;
    this.rank = attributes.rank;
    this.id = attributes.id;

    this.credentials = function(){
      return {
        "email": this.email,  
        "password": this.password
      };
    };
    
    this.toJsonString = function(){
      return JSON.stringify(this);
    };
  };
  window.TimeApp.User = User;
})();