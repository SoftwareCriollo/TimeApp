(function(){
  window.TimeApp = window.TimeApp || {};
  var flag = true;
  var memberId;

  var Timeline = function(attributes) {
    attributes = attributes || {};
    this.project_id = attributes.project_id;
    this.project_name = attributes.project_name;
  };

  var Paint = function(url, member) {
      memberId = member;
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
    return (currentWeek() == cardWeek(date));
  };

  var isPastWeek = function(date) {
    var pastWeek = currentWeek() - 1;

    return (cardWeek(date) == pastWeek);
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
    $currentWeek = $('.current-week');
    var weekClass = ($currentWeek.hasClass('left') ? "left" : "right");

    $currentWeek.after($('<div>', {class: 'this-week week-' + weekClass})
                .append($('<span>', {class: 'f-'+weekClass, text: 'THIS WEEK'})));
  };

  var createLastWeekMsg = function() {
    $lastWeek = $('.last-week');
    var weekClass = ($lastWeek.hasClass('left') ? "left" : "right");

    $lastWeek.after($('<div>', {class: 'last-week-tag week-' + weekClass})
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

    var customClass = "custom-week";

    if(isCurrentWeek(date))
      customClass = "current-week";
    else if(isPastWeek(date))
      customClass = "last-week";

    $firstContainer = createFirstContainer(strSide);
    $secondContainer = createSecondContainer(strSide, customClass);
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
  var createSecondContainer = function(side, customClass) {
    return $("<div>", {class: "timeline-panel " + side.toLowerCase() + " " + customClass.toLowerCase()});
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
      createTask(index);
    }

    return $p.append($ul);
  };

  var createTask = function(index) {
      var shortName = "";
      var date = new Date(index[i].due);
      var due = isToday(date) ? "<label class='timeline-today'>TODAY</label>" : "<span>" + formatDateMDY(date) + "</span>";

      if(index[i].board_name != null) {
          shortName = index[i].name.trim()
                      .substring(0, 30)
                      .split(" ")
                      .join(" ") + "...";

          var members = index[i].members;

          $li = $("<li>");
          $li.append($("<span>", {text: index[i].board_name + ": "}).addClass("time"));
          $li.append($("<a>", {text: shortName, href: index[i].url, target: "_blank"}).addClass("a-timeline"));
          $li.append(" - " + due);

          var isLastMember = false;
          var isFirstMember = false;

          if(memberId != null) {
              isLastMember = (members[members.length-1].id == memberId);
              isFirstMember = (members[0].id == memberId);
          }

          for(var j=0; j < members.length; j++) {
              if(members[j].id != memberId) {
                  var member = members[j].username;
                  var separator = "";

                  if (j < members.length - 1 && !isLastMember)
                      separator = ", ";

                  if(isFirstMember) {
                    if(j == 1)
                        $li.append($("<span>", {text: " - "}));
                  } else {
                    if (j == 0)
                      $li.append($("<span>", {text: " - "}));
                  }
                  $li.append($("<a>", {
                      text: member,
                      href: "/#/timeline/member/" + members[j].id,
                      target: "_blank",
                      class: "timeline-member"
                  })).append(separator);
              }
          }

          //var str = $li.replace(/,\s*$/, "");

          $ul.append($li);
      } else {
          shortName = index[i].name.trim()
                      .substring(0, 62)
                      .split(" ")
                      .join(" ") + "...";
          $ul.append($("<li>").append($("<a>", {text: shortName, href: index[i].url, target: "_blank"}).addClass("a-timeline")).append(" - " + due));
      }


  };

  window.TimeApp.Timeline = Timeline;
  window.TimeApp.Paint = Paint;
})();
