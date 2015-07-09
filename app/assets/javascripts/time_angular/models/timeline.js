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
      if($.isEmptyObject(data)) {
        noCardsMsg();
      } else {
        $firstMonth = createMonth(data.first_month);
        $(".timeline").append($firstMonth);

        createIterations(data.iterations);

        $lastMonth = createMonth(data.last_month);
        $(".timeline").append($lastMonth);
      }
      $('.loading-spinner').hide();
      createCurrentWeekMsg();
      createLastWeekMsg();
    });
  };

  Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
  };

  var currentWeek = function() {
    var today = new Date();
    return today.getWeek();
  };

  var cardWeek = function(date) {
    var d = new Date(date);
    var cDate = new Date(d.getFullYear(),d.getMonth(),d.getDate());

    return cDate.getWeek();
  };

  var isCurrentWeek = function(date) {
    return (currentWeek() == cardWeek(date) ? true : false);
  };

  var isPastWeek = function(date) {
    var pastWeek = currentWeek() - 1;

    return (cardWeek(date) == pastWeek ? true : false);
  };

  var noCardsMsg = function() {
    $noCardsMsg = $("<div class='no-cards-msg'>").html("No activities were found for the selected project");
    $(".timeline").append($noCardsMsg);
  };

  var createIterations = function(iterations){
    for(var date in iterations){
      $iteration = createIteration(date, iterations[date]);
      $(".timeline").append($iteration);
    }
  };

  var createCurrentWeekMsg = function() {
    var weekClass = ($('.current-week').hasClass('left') ? "left" : "right");

    $('.current-week').after($('<div>', {class: 'this-week week-'+weekClass})
                      .append($('<span>', {class: 'f-'+weekClass, text: 'THIS WEEK'})));
  };

  var createLastWeekMsg = function() {
    var weekClass = ($('.last-week').hasClass('left') ? "left" : "right");

    $('.last-week').after($('<div>', {class: 'last-week-tag week-'+weekClass})
                   .append($('<span>', {class: 'f-'+weekClass, text: 'LAST WEEK'})));
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
  var createIteration = function(date, index) {
    strSide = side();

    var current = (isCurrentWeek(date) ? "current-week" : "");
    var past = (isPastWeek(date) ? "last-week" : "");

    $firstContainer = createFirstContainer(strSide);
    $secondContainer = createSecondContainer(strSide, current, past);
    $tasks = createTasks(index);
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
  var createSecondContainer = function(side, current, past) {
    return $("<div>", {class: "timeline-panel " + side.toLowerCase() + " " + current.toLowerCase() + " " + past.toLowerCase()});
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
  };

  var isToday = function(date) {
    var today = new Date();
    var cardDate = new Date(date);

    return (today.toDateString() === cardDate.toDateString());
  };

  /**
   * @return String <li>Task Description</li>
   */
  var createTasks = function(index) {
    count = index.length;

    $p = $("<p>");
    $ul = $("<ul>");

    for(i=0; i<count; i++) {
      var date = new Date(index[i].due);
      var text = isToday(date) ? "<label class='timeline-today'>TODAY</label>" : formatDateMDY(date);

      var shortName = index[i].name.trim()
                                   .substring(0, 62)
                                   .split(" ")
                                   .join(" ") + "...";
      $ul.append($("<li>").append($("<a>", {text: shortName, href: index[i].url, target: "_blank"}).addClass("a-timeline")).append(" - " + text));
    }

    return $p.append($ul);
  };

  window.TimeApp.Timeline = Timeline;
  window.TimeApp.Paint = Paint;
})();
