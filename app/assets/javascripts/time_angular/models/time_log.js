(function(){
  var TimeApp = window.TimeApp ||= {}
  var timeLog = TimeApp.timeLog = {};
  timeLog = function(attributes){
    attributes ||= {};
    this.project_id = attributes.project_id;
    this.project_name = attributes.project_name;
    this.time_logs[] = attributes.time_logs;

    this.toJsonString = function(){
      this.attributes;
    };
  };
})();



