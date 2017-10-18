$(document).ready(function() {

  document.getElementById('btnAddTask').addEventListener('click', AddNewTask);

  // ====== Variables ======
  var savedTaskListFileName = 'savedTaskList';

  // Status variables
  var divDayStatus = document.getElementById('dayStatus');
  var dayStatusMessages = [
    '', // Default message
    'Time for staff meeting soon', // Show Mondays between 8am - 9am
    'Time for devotionals soon', // Show Wednesdays between 8am - 9am
    'Lunch is coming up soon', // Show everyday between 11:30am - 1pm
    'Time to head home for the day' // Show everyday starting at 4pm
  ];

  // To Do list variables
  var txtNewTask = document.getElementById('txtNewTask');
  var divToDoTaskList = document.getElementById('toDoTaskList');
  var divInProgressTaskList = document.getElementById('inProgressTaskList');
  var divCompletedTaskList = document.getElementById('completedTaskList');

  var taskItemBegining = '<a class='task list-group-item' ';
  var taskItemEnding = '';
  var defaultTaskListStructure = {
    'toDo':[],
    'inProgress':[],
    'completed':[]
  };
  var taskList = LoadTasksLists();

  // Clock variables
  var txtCurrentTime = document.getElementById('txtCurrentTime');
  var txtCurrentDate = document.getElementById('txtCurrentDate');
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var currentTimeString = '';
  var currentDateString = '';
  var currentHours;
  var currentMinutes;
  var currentTime = new Date();
  var currentDay = currentTime.getDay();

  // Weather variables
  var divCurrentWeather = document.getElementById('divCurrentWeather');
  var weatherApiKey = '86dbcdc34723f371d926bc1c9dba07dd';

  // Quote variables
  var divDailyQuote = document.getElementById('divDailyQuote');
  var defaultQuote = '<blockquote><p>Mere change is not growth. Growth is the synthesis of change and continuity, and where there is no continuity there is no growth.</p><footer><cite>C.S. Lewis</cite></footer></blockquote>';

  UpdateClock();
  UpdateWeather();
  UpdateQuote();
  UpdateTaskLists();
  UpdateStatus();


  // ====== To Do List Functions ======
  function AddNewTask() {
    var newTaskName = txtNewTask.value;
    var newTaskId = taskList.toDo.length;
    txtNewTask.value = '';

    taskList.toDo[newTaskId] = {
      'taskName':newTaskName
    };

    UpdateTaskLists();
  }

  function MoveToInProgress() {
    var oldTaskId = parseInt(this.id);
    var taskName = taskList.toDo[oldTaskId].taskName;
    var newTaskId = taskList.inProgress.length;

    taskList.inProgress[newTaskId] = {
      'taskName':taskName
    };
    delete taskList.toDo[oldTaskId];

    UpdateTaskLists();
  }

  function CompleteTask() {
    var oldTaskId = parseInt(this.id);
    var taskName = taskList.inProgress[oldTaskId].taskName;
    var newTaskId = taskList.completed.length;

    taskList.completed[newTaskId] = {
      'taskName':taskName
    };
    delete taskList.inProgress[oldTaskId];

    UpdateTaskLists();
  }

  function DeleteTask() {
    var oldTaskId = parseInt(this.id);
    delete taskList.completed[oldTaskId];
    UpdateTaskLists();
  }

  function UpdateTaskLists() {

    var toDoListHTML = '&nbsp;';
    var inProgressHTML = '&nbsp;';
    var completedTaskListHTML = '&nbsp;';

    var numToDoTasks = 0;
    var numInProgressTasks = 0;
    var numCompletedTasks = 0;

    // Update To Do List HTML
    for (var toDoItem in taskList.toDo) {
      if (taskList.toDo[toDoItem] != null) {
        var itemName = taskList.toDo[toDoItem].taskName;
        toDoListHTML += taskItemBegining + 'id="task-' + toDoItem + '">' + itemName + '<button id="' + toDoItem + 'btn class="btn btn-default task-move-btn pull-right" type="button"><span class="glyphicon glyphicon-arrow-right"></span></button></a>';
        numToDoTasks++;
      }
    }
    divToDoTaskList.innerHTML = toDoListHTML;

    if (divToDoTaskList.innerHTML == '&nbsp;') {
      divToDoTaskList.innerHTML = 'No tasks right now';
    }

    // Update In Progress List HTML
    for (var inProgressItem in taskList.inProgress) {
      if (taskList.inProgress[inProgressItem] != null) {
        var itemName = taskList.inProgress[inProgressItem].taskName;
        inProgressHTML += taskItemBegining + 'id='task-' + inProgressItem + ''>' + itemName + '<button id='' + inProgressItem + 'btn' class='btn btn-default task-complete-btn pull-right' type='button'><span class='glyphicon glyphicon-ok'></span></button></a>';
        numInProgressTasks++;
      }
    }
    divInProgressTaskList.innerHTML = inProgressHTML;

    // Update Completed List HTML
    for (var completedItem in taskList.completed) {
      if (taskList.completed[completedItem] != null) {
        var itemName = taskList.completed[completedItem].taskName;
        completedTaskListHTML += taskItemBegining + 'id='task-' + completedItem + ''>' + itemName + '<button id='' + completedItem + 'btn' class='btn btn-default task-delete-btn pull-right' type='button'><span class='glyphicon glyphicon-trash'></span></button></a>';
        numCompletedTasks++;
      }
    }
    divCompletedTaskList.innerHTML = completedTaskListHTML;

    // Update number of in progress tasks
    document.getElementById('numToDoTasks').innerHTML = numToDoTasks;
    document.getElementById('numInProgressTasks').innerHTML = numInProgressTasks;
    document.getElementById('numCompletedTasks').innerHTML = numCompletedTasks;

    // Add event handlers for all move to in progress buttons
    var allBtns = document.getElementsByClassName('task-move-btn');
    for (var i = 0; i < allBtns.length; i++)
    {
       allBtns[i].addEventListener('click', MoveToInProgress);
    }
    // Add event handlers for all complete buttons
    var allBtns = document.getElementsByClassName('task-complete-btn');
    for (var i = 0; i < allBtns.length; i++)
    {
       allBtns[i].addEventListener('click', CompleteTask);
    }
    // Add event handlers for all delete buttons
    var allBtns = document.getElementsByClassName('task-delete-btn');
    for (var i = 0; i < allBtns.length; i++)
    {
       allBtns[i].addEventListener('click', DeleteTask);
    }

    SaveTaskLists();
  }

  function LoadTasksLists() {
    var returnValue;
    var textJSON = localStorage.getItem(savedTaskListFileName);
    if (textJSON != null) {
      returnValue = JSON.parse(textJSON);
    } else {
      returnValue = defaultTaskListStructure;
    }
    return returnValue;
  }

  function SaveTaskLists() {
    RemoveNulls(taskList);
    var textJSON = JSON.stringify(taskList);
    localStorage.setItem(savedTaskListFileName, textJSON);
    console.log('Saved tasks as: ' + textJSON);
  }

  function RemoveNulls(obj) {
    var isArray = obj instanceof Array;
    for (var k in obj) {
      if (obj[k] == null) isArray ? obj.splice(k,1) : delete obj[k];
      else if (typeof obj[k] == 'object') RemoveNulls(obj[k]);
    }
  }


  // ====== Clock Functions ======
  function UpdateClock() {
    currentTime = new Date();
    currentDay = currentTime.getDay();
    var currentMonth = currentTime.getMonth();
    var currentDate = currentTime.getDate();
    var dateSuffix = '';
    var currentYear = currentTime.getFullYear();
    currentHours = currentTime.getHours();
    currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();

    currentMinutes = ( currentMinutes < 10 ? '0' : '' ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? '0' : '' ) + currentSeconds;

    var timeOfDay = (currentHours < 12 ) ? 'AM' : 'PM';
    currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;
    currentHours = (currentHours == 0) ? 12 : currentHours;

    if (currentDate == 1 || currentDate == 21 || currentDate == 31) {
      dateSuffix = 'st';
    } else if (currentDate == 2 || currentDate == 22) {
      dateSuffix = 'nd';
    } else if (currentDate == 3 || currentDate == 23) {
      dateSuffix = 'rd';
    } else {
      dateSuffix = 'th';
    }

    currentTimeString = currentHours + ':' + currentMinutes + ':' + currentSeconds + ' ' + timeOfDay;
    currentDateString = days[currentDay] + ', ' + months[currentMonth] + ' ' + currentDate + dateSuffix + ', ' + currentYear;

    txtCurrentTime.innerHTML = currentTimeString;
    txtCurrentDate.innerHTML = currentDateString;
  }
  window.setInterval(UpdateClock, 1000);


  // ====== Weather Functions ======
  function UpdateWeather() {
    var currentWeather = 'http://api.openweathermap.org/data/2.5/weather?zip=37027,us&units=imperial&appid=' + weatherApiKey;
    $.getJSON(currentWeather, function(data) {
      console.log('Weather updated at ' + currentTimeString);
      var currentTemp = Math.round(data.main.temp) + '<i class='wi wi-fahrenheit'></i>';
      var currentHumidity = '<span class='pull-right'><i class='wi wi-humidity'></i> ' + Math.round(data.main.humidity) + '%</span>';
      var currentWindSpeed = '<span class='pull-left'><i class='wi wi-strong-wind'></i> ' + Math.round(data.wind.speed) + 'mph</span>';
      var currentIcon = '<i class='wi wi-owm-day-' + data.weather[0].id + ''></i>';
      divCurrentWeather.innerHTML = '<h1>' + currentIcon + ' ' + currentTemp + '</h1><br/><p>' + currentWindSpeed + ' ' + currentHumidity + '</p>';
    });
  }
  window.setInterval(UpdateWeather, 180000)


  // ====== Quote Functions ======
  function UpdateQuote() {
    var currentQuote = 'http://quotes.rest/qod.json';
    var didUpdate = false;
    $.getJSON(currentQuote, function(quoteData) {
      console.log('Quote updated at ' + currentTimeString);
      var quoteContent = '<p>' + quoteData.contents.quotes[0].quote + '</p>';
      var quoteAuthor = '<footer><cite>' + quoteData.contents.quotes[0].author + '</cite></footer>';
      divDailyQuote.innerHTML = '<blockquote>' + quoteContent + quoteAuthor + '</blockquote>';
      didUpdate = true;
    });
    if (!didUpdate) {
      divDailyQuote.innerHTML = defaultQuote;
    }
  }
  window.setInterval(UpdateQuote, 3600000)

  // ====== Status Functions ======
  function UpdateStatus() {
    var timeIn24Hours = currentHours + currentMinutes;
    divDayStatus.innerHTML = dayStatusMessages[0];

    if (currentDay == 1 && timeIn24Hours >= 800 && timeIn24Hours <= 900) {
      divDayStatus.innerHTML = dayStatusMessages[1];
    }
    else if (currentDay == 3 && timeIn24Hours >= 800 && timeIn24Hours <= 900) {
      divDayStatus.innerHTML = dayStatusMessages[2];
    }
    else if (timeIn24Hours >= 1130 && timeIn24Hours <= 1300) {
      divDayStatus.innerHTML = dayStatusMessages[3];
    }
    else if (timeIn24Hours >= 1600) {
      divDayStatus.innerHTML = dayStatusMessages[4];
    }
  }
  window.setInterval(UpdateStatus, 300000)

});
