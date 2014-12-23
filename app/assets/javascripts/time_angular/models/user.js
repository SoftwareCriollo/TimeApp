(function(){
  timeApp = windows.timeApp ||= {};

  timeApp.User = function(attributes){
    this.email = attributes.email;
    this.name = attributes.name;
    this.rank = attributes.rank || "developer";
    this.id = attributes.id;
  };

})();