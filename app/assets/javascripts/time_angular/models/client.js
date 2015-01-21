(function(){
  window.TimeApp = window.TimeApp || {};
  var clients = window.TimeApp;
  clients = function(attributes){
    attributes = attributes || {};
    this.client_name = attributes.client_name;
    this.client_email = attributes.client_email;
    this.client_git = attributes.client_git;
    this.client_ssh = attributes.client_ssh;


  };
})();

