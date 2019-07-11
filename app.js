//api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apikey}
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const maxTemp = document.querySelector(".temperature-max");
const minTemp = document.querySelector(".temperature-min");

const KELVIN = 273;
const key = "cb2c28bb63fa2d50f3b4bc5fe46d0add";
const weather = {
  temperature: {
    value: 18,
    unit: "celsius",
    temp_max: 0,
    temp_min: 0
  },
  description: "few clouds",
  iconId: "01d",
  city: "London",
  country: "GB"
};
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
}
// set user position
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}
// shows error when geolocations is denied
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${error.message}😢</p>`;
}
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  maxTemp.innerHTML = `<span>Maximum</span> ${
    weather.temperature.temp_max
  }°<span>C</span>`;
  minTemp.innerHTML = `<span>Minimum</span> ${
    weather.temperature.temp_min
  }°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// get weather
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  console.log(api);
  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.temperature.temp_max = Math.floor(data.main.temp_max - KELVIN);
      weather.temperature.temp_min = Math.floor(data.main.temp_min - KELVIN);
    })
    .then(function() {
      displayWeather();
    });
}
function celsiusToFar(temp) {
  return temp * 1.8 + 32;
}
tempElement.addEventListener("click", function() {
  if (weather.temperature.value === undefined) return;
  if (weather.temperature.unit == "celsius") {
    let far = Math.floor(celsiusToFar(weather.temperature.value));
    let farMax = Math.floor(celsiusToFar(weather.temperature.temp_max));
    let farMin = Math.floor(celsiusToFar(weather.temperature.temp_min));
    tempElement.innerHTML = `${far}°<span>F</span>`;
    maxTemp.innerHTML = `<span>Maximum</span> ${farMax}°<span>C</span>`;
    minTemp.innerHTML = `<span>Minimum</span> ${farMin}°<span>C</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    maxTemp.innerHTML = `<span>Maximum</span> ${
      weather.temperature.temp_max
    }°<span>C</span>`;
    minTemp.innerHTML = `<span>Minimum</span> ${
      weather.temperature.temp_min
    }°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
