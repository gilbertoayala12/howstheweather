//api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apikey}
const iconElement = [...document.querySelectorAll(".weather-icon")];
const tempElement = [...document.querySelectorAll(".temperature-value p")];
const descElement = [
  ...document.querySelectorAll(".temperature-description p")
];
const locationElement = [...document.querySelectorAll(".location p")];
const maxTemp = [...document.querySelectorAll(".temperature-max")];
const minTemp = [...document.querySelectorAll(".temperature-min")];
const notificationElement = [...document.querySelectorAll(".notification")];
const KELVIN = 273;
const key = "cb2c28bb63fa2d50f3b4bc5fe46d0add";

/**
 * TODO
 * change struct of the weather object so i can call 3 day forecast ✅
 * call the api and structure it for a 3 day forecast and thats it ✅
 * every const up there has to be an array with the spread thingy✅
 * within the display weather find a way to get the 3 day forecast a the same time✅
 * change every innerHTML for a node struct with append shizzle
 *
 * maybe just maybe when everything is done add a little man at the bottom?
 */
const weather = {
  dayOne: {
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
  },
  dayTwo: {
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
  },
  dayThree: {
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
  }
};
const refArray = Object.entries(weather);
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
  for (var i = 0; i < notificationElement.length; i++) {
    var nodo = document.createElement("p");
    nodo.innerText = `${error.message}😢`;
    notificationElement[i].appendChild(nodo);
    notificationElement[i].style.display = "block";
  }
}
function displayWeather() {
  var nodoP = document.createElement("p");
  var nodoImg = document.createElement("img");
  
  // day one
  iconElement[0].innerHTML = `<img src="icons/${refArray[0][1].iconId}.png"/>`;
  tempElement[0].innerHTML = `${
    weather.dayOne.temperature.value
  }°<span>C</span>`;
  maxTemp[0].innerHTML = `<span>Maximum</span> ${
    weather.dayOne.temperature.temp_max
  }°<span>C</span>`;
  minTemp[0].innerHTML = `<span>Minimum</span> ${
    weather.dayOne.temperature.temp_min
  }°<span>C</span>`;
  descElement[0].innerHTML = weather.dayOne.description;
  locationElement[0].innerHTML = `${weather.dayOne.city}, ${
    weather.dayOne.country
  }`;

  // Day 2
  iconElement[1].innerHTML = `<img src="icons/${weather.dayTwo.iconId}.png"/>`;
  tempElement[1].innerHTML = `${
    weather.dayTwo.temperature.value
  }°<span>C</span>`;
  maxTemp[1].innerHTML = `<span>Maximum</span> ${
    weather.dayTwo.temperature.temp_max
  }°<span>C</span>`;
  minTemp[1].innerHTML = `<span>Minimum</span> ${
    weather.dayTwo.temperature.temp_min
  }°<span>C</span>`;
  descElement[1].innerHTML = weather.dayTwo.description;
  locationElement[1].innerHTML = `${weather.dayTwo.city}, ${
    weather.dayTwo.country
  }`;

  // day 3
  iconElement[2].innerHTML = `<img src="icons/${
    weather.dayThree.iconId
  }.png"/>`;
  tempElement[2].innerHTML = `${
    weather.dayThree.temperature.value
  }°<span>C</span>`;
  maxTemp[2].innerHTML = `<span>Maximum</span> ${
    weather.dayThree.temperature.temp_max
  }°<span>C</span>`;
  minTemp[2].innerHTML = `<span>Minimum</span> ${
    weather.dayThree.temperature.temp_min
  }°<span>C</span>`;
  descElement[2].innerHTML = weather.dayThree.description;
  locationElement[2].innerHTML = `${weather.dayThree.city}, ${
    weather.dayThree.country
  }`;
}

// get weather
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  let api2 = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=3&appid=${key}`;
  console.log(api2);
  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      refArray[0][1].temperature.value = Math.floor(data.main.temp - KELVIN);
      refArray[0][1].description = data.weather[0].description;
      refArray[0][1].iconId = data.weather[0].icon;
      refArray[0][1].city = data.name;
      refArray[0][1].country = data.sys.country;
      refArray[0][1].temperature.temp_max = Math.floor(
        data.main.temp_max - KELVIN
      );
      refArray[0][1].temperature.temp_min = Math.floor(
        data.main.temp_min - KELVIN
      );
    })
    .then(function() {
      fetch(api2)
        .then(function(response) {
          let data = response.json();
          return data;
        })
        .then(function(data) {
          for (var i = 1; i < refArray.length; i++) {
            refArray[i][1].temperature.value = Math.floor(
              data.list[i].temp.day - KELVIN
            );
            refArray[i][1].description = data.list[i].weather[0].description;
            refArray[i][1].iconId = data.list[i].weather[0].icon;
            refArray[i][1].city = data.city.name;
            refArray[i][1].country = data.city.country;
            refArray[i][1].temperature.temp_max = Math.floor(
              data.list[i].temp.max - KELVIN
            );
            refArray[i][1].temperature.temp_min = Math.floor(
              data.list[i].temp.min - KELVIN
            );
          }
        })
        .then(function() {
          displayWeather();
        });
    });
}
function celsiusToFar(temp) {
  return temp * 1.8 + 32;
}
// // wait
// tempElement.forEach(function(el, index) {
//   el.addEventListener("click", function() {
//     if (weather.dayOne.temperature.value === undefined) return;
//     if (weather.dayOne.temperature.unit == "celsius") {
//       let far = Math.floor(celsiusToFar(weather.dayOne.temperature.value));
//       let farMax = Math.floor(
//         celsiusToFar(weather.dayOne.temperature.temp_max)
//       );
//       let farMin = Math.floor(
//         celsiusToFar(weather.dayOne.temperature.temp_min)
//       );
//       tempElement[index].innerHTML = `${far}°<span>F</span>`;
//       maxTemp[index].innerHTML = `<span>Maximum</span> ${farMax}°<span>C</span>`;
//       minTemp[index].innerHTML = `<span>Minimum</span> ${farMin}°<span>C</span>`;
//       weather.dayOne.temperature.unit = "fahrenheit";
//     } else {
//       tempElement[index].innerHTML = `${
//         weather.dayOne.temperature.value
//       }°<span>C</span>`;
//       maxTemp[index].innerHTML = `<span>Maximum</span> ${
//         weather.dayOne.temperature.temp_max
//       }°<span>C</span>`;
//       minTemp[index].innerHTML = `<span>Minimum</span> ${
//         weather.dayOne.temperature.temp_min
//       }°<span>C</span>`;
//       weather.dayOne.temperature.unit = "celsius";
//     }
//   });
// });
