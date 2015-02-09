(function(){
  window.TimeApp = window.TimeApp || {};
  var Client = function(attributes){
    attributes = attributes || {};
    this.name = attributes.name;
    this.email = attributes.email;
    this.git = attributes.git;
    this.ssh = attributes.ssh;
  
    this.toJsonToServer = function() {
      return {
        'project_id': this.project_id,
        'name': this.name,
        'email': this.email,
        'git': this.git,
        'ssh' : this.ssh
      };
    }

  };

  window.TimeApp.Client = Client;
})();

