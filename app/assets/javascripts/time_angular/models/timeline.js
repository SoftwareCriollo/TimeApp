(function(){
  window.TimeApp = window.TimeApp || {};
  var flag = true;

  var Timeline = function(attributes) {
    attributes = attributes || {};
    this.project_id = attributes.project_id;
    this.project_name = attributes.project_name;
  };

  var Paint = function(url) {
      $.getJSON( url, function( data ) {
          $firstMonth = createMonth(data.first_month);
          $(".timeline").append($firstMonth);

          createIterations(data.iterations);

          $lastMonth = createMonth(data.last_month);
          $(".timeline").append($lastMonth);
      });
  };

  var createIterations = function(iterations){
    var number = 0;
    for(var date in iterations){
      number = number + 1;
      $iteration = createIteration(date, iterations[date], number);
      $(".timeline").append($iteration);
    }
  };

  /**
   * This function puts info on the page.
   * returns nothings.
   * modifies a lot of stuff on the website
   */
  var createHeader = function(o) {
    $(".title h1:first").html(o.title);
    $(".subtitle p:first").html(o.subtitle);
    $(".subtitle:nth-child(2) p").html(o.descrition);
    $(".velocity").html(o.velocity);
    $(".delivery-date").html(o.delivery);
    $(".budget").html(o.budget);
    $(".team").html("");
    o.team.forEach(function(m,i,a){
      $(".team").append("<p>" + m  + "</p>");
    })
  };

  /**
   * Return the side of the boxes
   * @return String
   */
  var side = function() {
    if (flag == true) {
      flag = false;
      return 'Right';
    } else {
      flag = true;
      return 'Left'
    }
  };

  var createMonth = function(monthName) {
    return $("<li>", {text: monthName.toUpperCase(), class: "month"});
  };

  /**
   * @return String
   */
  var createIteration = function(date, index, number) {
    strSide = side();

    $firstContainer = createFirstContainer(strSide);
    $secondContainer = createSecondContainer(strSide);
    $title = createTitle(date, number);
    $tasks = createTasks(index);
    $secondContainer.append($title);
    $secondContainer.append($tasks);

    return $firstContainer.append($secondContainer);
  };

  /**
   * @return String <li class="animated visible fadeInLeft fadeInRight" data-animation="fadeInLeft"></li>
   */
  var createFirstContainer = function(side) {
    var fadeIn = "fadeIn"+side;
    return $("<li class='animated visible "+fadeIn+"' data-animation='"+fadeIn+"'>");
  };

  /**
   * @return String <div class="timeline-panel right left"></div>
   */
  var createSecondContainer = function(side) {
    return $("<div>", {class: "timeline-panel "+side.toLowerCase()});
  };

  /**
   * @return String <h4>Iteration #1 - 25/06/2015</h4>
   */
  var createTitle = function(date, number) {
    var formattedDate = formatDateMDY (date);

    return $("<h4>", {text: "Iteration #"+number+" - "+formattedDate});
  };

  var formatDateMDY = function(date) {
    var d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    return month + "/" + day + "/" + year;
  }

  /**
   * @return String <li>Task Description</li>
   */
  var createTasks = function(index) {
    count = index.length;

    $p = $("<p>");
    $ul = $("<ul>");

    for(i=0; i<count; i++) {
      $ul.append($("<li>", {text: index[i].name}));
    }

    return $p.append($ul);
  };

  window.TimeApp.Timeline = Timeline;
  window.TimeApp.Paint = Paint;
})();
