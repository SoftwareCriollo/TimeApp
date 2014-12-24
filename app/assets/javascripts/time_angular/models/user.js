(function(){

  var User = function(attributes){
    attributes = attributes || {} 
    this.email = attributes.email;
    this.password = attributes.password;
    this.name = attributes.name;
    this.rank = attributes.rank || "developer";
    this.id = attributes.id;

    this.credentials = function(){
      return {
        "email": this.email,  
        "password": this.password
      };
    };
  };

  window.TimeApp.User = User;

})();