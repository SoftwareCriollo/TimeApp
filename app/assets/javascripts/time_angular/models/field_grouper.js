'use strict';

(function(){
  var FieldGrouper = function(collection){
    this.collection = collection || [];
    this.group_by = function(field){
      var group = {};
      this.collection.forEach(function(element){
        var value_field = element[field];
          if(!group[value_field])
             group[value_field] = [];
          group[value_field].push(element); 
      });
      return group;
    };
  };
  window.TimeApp.FieldGrouper = FieldGrouper; 
})();