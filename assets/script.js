var input = document.querySelector("input[name=city");
var submitBtn = document.querySelector("#searchBtn");
var prevCitiesContainer = document.querySelector("#prev-cities");
var mainContainer = document.querySelector("#main-container");
var forecast = document.querySelector("#forecast");
var form = document.querySelector("form");
var cityBtns = [];
var openWeatherApiKey = "d91f911bcf2c0f925fb6535547a5ddc9";

function searchAndGenWeather(city) {
  mainContainer.innerHTML = "";
  forecast.innerHTML = "";

  var geoLocateCityURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    ",US&limit=5&appid=" +
    openWeatherApiKey;

  fetch(geoLocateCityURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityData = data[0];
      var getWeatherUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        cityData.lat +
        "&lon=" +
        cityData.lon +
        "&exclude=minutely,hourly&units=imperial&appid=" +
        openWeatherApiKey;

      fetch(getWeatherUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          var cityName = document.createElement("h2");
          cityName.textContent = city.toUpperCase() + " "+  moment.unix(weatherData.current.sunrise).format("DD/MM/YYYY");
          var WeatherIcon = document.createElement("img");
          WeatherIcon.setAttribute(
            "src",
            "https://openweathermap.org/img/w/" +
              weatherData.current.weather[0].icon +
              ".png"
          );
          cityName.append(WeatherIcon);

          mainContainer.append(cityName);

          var WeatherList = document.createElement("ul");

          var temp = document.createElement("li");
          temp.textContent = "Temp: " + weatherData.current.temp + " Fahrenheit";
          WeatherList.append(temp);

          var wind = document.createElement("li");
          wind.textContent =
            "Wind Speed: " + weatherData.current.wind_speed + " mph";
          WeatherList.append(wind);

          var humidity = document.createElement("li");
          humidity.textContent =
            "Humidty: " + weatherData.current.humidity + "%";
          WeatherList.append(humidity);

          var uvi = document.createElement("li");
          uvi.textContent = "UV index: " + weatherData.current.uvi;
          WeatherList.append(uvi);

          mainContainer.append(WeatherList);

          
          var forecastHeader = document.createElement("h2");
          forecastHeader.textContent = "5-Day Forecast";
          forecast.append(forecastHeader);

          for (var i = 0; i < 5; i++) {
            var dayZweather = weatherData.daily[i];
            var dayZweatherCard = document.createElement("ul");

            var date = moment.unix(dayZweather.sunrise).format("DD/MM/YYYY");

            dayZweatherCard.append(date);
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute(
              "src",
              "https://openweathermap.org/img/w/" +
                dayZweather.weather[0].icon +
                ".png"
            );
            dayZweatherCard.append(weatherIcon);

            var temp = document.createElement("li");
            temp.textContent = "Temp: " + dayZweather.temp.day + " Fahrenheit";
            dayZweatherCard.append(temp);

            var wind = document.createElement("li");
            wind.textContent = "Wind speed: " + dayZweather.wind_speed + " mph";
            dayZweatherCard.append(wind);

            var humidity = document.createElement("li");
            humidity.textContent = "Humidty: " + dayZweather.humidity + "%";
            dayZweatherCard.append(humidity);

            forecast.append(dayZweatherCard);
          }
        });
    });
}
form.addEventListener("click", function (e) {
  e.preventDefault();
  var searchVal = input.value.trim();

  if (!searchVal) {
    return;
  }

  cityBtns.push(searchVal)
  searchAndGenWeather(searchVal);
  makeBtns()
});

function initLoad() {
  var prevCitiesBtns = localStorage.getItem("previousCities");
  if (prevCitiesBtns) {
    cityBtns = JSON.parse(prevCitiesBtns);
    makeBtns();
  }
}

function makeBtns() {
  for (var i = 0; i < cityBtns.length; i++) {
    const city = cityBtns[i];
    var prevBtn = document.createElement("button");

    prevBtn.textContent = city;
    prevBtn.setAttribute("data-value", city);

    prevBtn.addEventListener("click", function () {
      var searchCity = this.getAttribute("data-value");
      searchAndGenWeather(searchCity);
    });
    prevCitiesContainer.append(prevBtn);
  }

  localStorage.setItem("previousCities", JSON.stringify(cityBtns));
}
initLoad()
