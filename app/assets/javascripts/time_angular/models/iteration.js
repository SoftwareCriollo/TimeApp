(function(){
  window.TimeApp =  window.TimeApp || {};
  var Iteration = function(attributes){
    attributes = attributes || {} 
    this.project_id = attributes.project_id;
    this.time = attributes.time;
    this.note = attributes.note;
    this.start = attributes.start;
    this.end_date = attributes.end_date;
    this.invoice = attributes.invoice;
    
  };
  window.TimeApp.Iteration = Iteration;
})();