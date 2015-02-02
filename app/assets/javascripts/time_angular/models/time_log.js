(function(){
  window.TimeApp =  window.TimeApp || {};
  var TimeLogger = function(attributes){
    attributes = attributes || {};
    this.project_id = attributes.project.id;
    this.project_name = attributes.project.name;
    this.timelogs = attributes.timelogs || [];

    this.toJson = function(){
      return {
        "project_id":this.project_id,
        "project_name":this.project_name,
        "timelogs_attributes": this.timelogs,
      };
    };
    this.hasTask = function(){
      return this.timelogs.length > 0;
    };

    this.toggleTasks = function(card){
      if(this.isSelected(card))
        this.removeCard(card);
      else
        this.addCard(card);
    };

    this.addCard = function(card){
      var dataTask = {"task_id":card.id, "task_name": card.name };
      this.timelogs.push(dataTask);
    };

    this.removeCard = function(card){ //function to remove a card in arrat tasks
      this.timelogs.splice(this.searchCard(card),1);
    };

    this.isSelected = function(card){
      return (this.searchCard(card) >= 0);
    };

    this.searchCard = function(card){
      var task = undefined;
      for (var i = this.timelogs.length - 1; i >= 0; i--) {
        task = this.timelogs[i];
        if(equals(task,card))
          return i;
      };
      return -1;
    }
    // Privates functions
    var equals = function(task,card){
      return task.task_id == card.id
    };
  };

  window.TimeApp.TimeLogger = TimeLogger;
})();





