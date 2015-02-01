(function(){
  window.TimeApp =  window.TimeApp || {};
  var Iteration = function(attributes){
    attributes = attributes || {} 
    this.project_id = attributes.project_id;
    this.time = attributes.time;
    this.note = attributes.note;
    this.start = attributes.start || new Date();
    this.end_date = attributes.end_date;
    this.invoice = attributes.invoice;
    
    this.toJsonToServer = function() {
      return {
        'project_id': this.project_id,
        'time': this.time,
        'note': this.note,
        'invoice': this.invoice,
        'start' : this.start
      };
    }
  };

  var format_date_server = function(date){
    var date = date.split("/");
    return new Date(date[2],date[1],date[0]);
  };

  window.TimeApp.Iteration = Iteration;
})();