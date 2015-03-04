'use strict';
(function(){
  var DateGrouper = function(collection){
    this.collection = collection || [];
    this.group_by = function(field,field2){
      var group = {};
      this.collection.forEach(function(element){
        var value_field = element[field];
          if(!group[value_field])
             group[value_field] = [];
        if(field2)
        {
          var value_field2 = element[field2];
          if(!group[value_field][value_field2])
            group[value_field][value_field2] = [];
          group[value_field][value_field2].push(element);
        }
        else
          group[value_field].push(element); 
      });
      return group;
    };
  };
  window.TimeApp.DateGrouper = DateGrouper; 
})();