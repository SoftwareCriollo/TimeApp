(function(){
  window.TimeApp = window.TimeApp || {};
  var flag = true;
  var number = 0;
  //var file = setFile();

  var configYML;

  var Timeline = function(attributes) {
    attributes = attributes || {};
    this.project_id = attributes.project_id;
    this.project_name = attributes.project_name;
  };

  var setFile = function() {
    hash = (location.hash).substr(1);

    if (hash === "") {
      return 'me.co';
    } else {
      return hash;
    }
  };

  var Paint = function(file) {
    configYML = YAML.load(file+'.yml');
    configYML.forEach(loopElements);
  };

  /**
   * Loop all Elements in Yaml File
   */
  var loopElements = function(element, index, array) {
    if (configYML[index].month != undefined) {
      $element = createMonth(configYML[index].month);
      $(".timeline").append($element);
    } else if (configYML[index].iteration != undefined) {
      $element = createIteration(index);
      $(".timeline").append($element);
    } else if (configYML[index].title!= undefined){
      createHeader(element);
    }
  };

  /**
   * This function puts info on the page.
   * returns nothings.
   * modifies a lot of stuff on the website
   */
  var createHeader = function(o) {
    console.log(o);
    $(".title h1:first").html(o.title);
    $(".subtitle p:first").html(o.subtitle);
    $(".subtitle:nth-child(2) p").html(o.descrition);
    $(".velocity").html(o.velocity);
    $(".delivery-date").html(o.delivery);
    $(".budget").html(o.budget);
    $(".team").html("");
    o.team.forEach(function(m,i,a){
      $(".team").append("<p>" + m  + "</p>")
      console.log(m);
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
  var createIteration = function(index) {
    strSide = side();

    $firstContainer = createFirstContainer(strSide);
    $secondContainer = createSecondContainer(strSide);
    $title = createTitle(configYML[index].iteration.date);
    //$tasks = createTasks(index);
    $descriptionContainer = createDescriptionContainer(index);

    $secondContainer.append($title);
    $secondContainer.append($descriptionContainer);

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
  var createTitle = function(date) {
    number = number + 1;
    return $("<h4>", {text: "Iteration #"+number+" - "+date});
  };

  var createDescriptionContainer = function(index) {
    url = configYML[index].iteration.url;
    name = configYML[index].iteration.name;

    $p = $("<p>");
    $ul = $("<ul>");

    $ul.append($("<li>", {text: name}));
    $ul.append($("<li>", {}).append($("<a>", { href: url }).text(url)));

    return $p.append($ul);
  };

  /**
   * @return String <li>Task Description</li>
   */
  var createTasks = function(index) {
    count = configYML[index].iteration.tasks.length;
    tasks = configYML[index].iteration.tasks;
    url = configYML[index].iteration.url;

    $p = $("<p>");
    $ul = $("<ul>");

    for(i=0; i<count; i++) {
      $ul.append($("<li>", {text: tasks[i].task}));
    }

    $ul.append($("<li>", {})
       .append($("<a>", { href: url }).text(url)));

    return $p.append($ul);
  };

  window.TimeApp.Timeline = Timeline;
  window.TimeApp.Paint = Paint;
})();
