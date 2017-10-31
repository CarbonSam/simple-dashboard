function initialize() {
  let txtCurrentTime = document.getElementById('txtCurrentTime');
  let txtCurrentDate = document.getElementById('txtCurrentDate');
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let currentTimeString = '';
  let currentDateString = '';
  let currentHours;
  let currentMinutes;
  let currentTime = new Date();
  let currentDay = currentTime.getDay();

  let divCurrentWeather = document.getElementById('divCurrentWeather');
  let weatherApiKey = '86dbcdc34723f371d926bc1c9dba07dd';

  let divDailyQuote = document.getElementById('divDailyQuote');
  let defaultQuote = '<blockquote><p>Mere change is not growth. Growth is the synthesis of change and continuity, and where there is no continuity there is no growth.</p><footer><cite>C.S. Lewis</cite></footer></blockquote>';


  let updateClock = () => {
    currentTime = new Date();
    currentDay = currentTime.getDay();
    let currentMonth = currentTime.getMonth();
    let currentDate = currentTime.getDate();
    let dateSuffix = '';
    let currentYear = currentTime.getFullYear();
    currentHours = currentTime.getHours();
    currentMinutes = currentTime.getMinutes();

    currentMinutes = ( currentMinutes < 10 ? '0' : '' ) + currentMinutes;

    let timeOfDay = (currentHours < 12 ) ? 'AM' : 'PM';
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

    currentTimeString = currentHours + ':' + currentMinutes + ' ' + timeOfDay;
    currentDateString = days[currentDay] + ', ' + months[currentMonth] + ' ' + currentDate + dateSuffix + ', ' + currentYear;

    txtCurrentTime.innerHTML = currentTimeString;
    txtCurrentDate.innerHTML = currentDateString;
  };
  window.setInterval(updateClock, 1000);


  let makeAjaxRequest = (source) => {
    let request = new XMLHttpRequest();

    request.open('GET', source);

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        return JSON.parse(request.responseText);
      }
    };

    request.send();
  };


  let updateWeather = () => {
    let currentWeather = 'http://api.openweathermap.org/data/2.5/weather?zip=37067,us&units=imperial&appid=' + weatherApiKey;
    let data = makeAjaxRequest(currentWeather);

    if (data) {
      let currentTemp = Math.round(data.main.temp) + '<i class="wi wi-fahrenheit"></i>';
      let currentHumidity = '<span class="pull-right"><i class="wi wi-humidity"></i> ' + Math.round(data.main.humidity) + '%</span>';
      let currentWindSpeed = '<span class="pull-left"><i class="wi wi-strong-wind"></i> ' + Math.round(data.wind.speed) + 'mph</span>';
      let currentIcon = '<i class="wi wi-owm-day-' + data.weather[0].id + '"></i>';

      divCurrentWeather.innerHTML = '<h1>' + currentIcon + ' ' + currentTemp + '</h1><br/><p>' + currentWindSpeed + ' ' + currentHumidity + '</p>';
    } else {
      let currentTemp = '--' + '<i class="wi wi-fahrenheit"></i>';
      let currentHumidity = '<span class="pull-right"><i class="wi wi-humidity"></i> ' + '--' + '%</span>';
      let currentWindSpeed = '<span class="pull-left"><i class="wi wi-strong-wind"></i> ' + '--' + 'mph</span>';
      let currentIcon = '<i class="wi wi-na"></i>';

      divCurrentWeather.innerHTML = '<h1>' + currentIcon + ' ' + currentTemp + '</h1><br/><p>' + currentWindSpeed + ' ' + currentHumidity + '</p>';
    }
  };
  window.setInterval(updateWeather, 180000);


  let updateQuote = () => {
    let currentQuote = 'http://quotes.rest/qod.json';
    let didUpdate = false;

    if (!didUpdate) {
      let quoteData = makeAjaxRequest(currentQuote);

      if (quoteData) {
        let quoteContent = '<p>' + quoteData.contents.quotes[0].quote + '</p>';
        let quoteAuthor = '<footer><cite>' + quoteData.contents.quotes[0].author + '</cite></footer>';

        divDailyQuote.innerHTML = '<blockquote>' + quoteContent + quoteAuthor + '</blockquote>';
        didUpdate = true;
      } else {
        divDailyQuote.innerHTML = defaultQuote;
      }
    }
  };
  window.setInterval(updateQuote, 3600000);

  updateClock();
  updateWeather();
  updateQuote();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
