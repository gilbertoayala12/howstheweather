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
const subtitle = [...document.querySelectorAll(".subtitle")];
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
function setDate() {
  let today = new Date();
  let tomorrow = new Date();
  let after = new Date();
  today.setDate(today.getDate(Date.now()));
  tomorrow.setDate(today.getDate() + 1);
  after.setDate(today.getDate() + 2);
  const dates = [
    today.toLocaleDateString(),
    tomorrow.toLocaleDateString(),
    after.toLocaleDateString()
  ];
  for (let i = 0; i < dates.length; i++) {
    subtitle[i].innerHTML = dates[i];
  }

  //console.log(subtitle);
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
  for (let i = 0; i < refArray.length; i++) {
    iconElement[i].innerHTML = `<img src="icons/${
      refArray[i][1].iconId
    }.png"/>`;
    tempElement[i].innerHTML = `${
      refArray[i][1].temperature.value
    }°<span>C</span>`;
    maxTemp[i].innerHTML = `<span>Maximum</span> ${
      refArray[i][1].temperature.temp_max
    }°<span>C</span>`;
    minTemp[i].innerHTML = `<span>Minimum</span> ${
      refArray[i][1].temperature.temp_min
    }°<span>C</span>`;
    descElement[i].innerHTML = refArray[i][1].description;
    locationElement[i].innerHTML = `${refArray[i][1].city}, ${
      refArray[i][1].country
    }`;
  }
}
// get weather
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  let api2 = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=3&appid=${key}`;
  //console.log(api2);
  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      // calls a different api hence the "hardcode"
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
          for (let i = 1; i < refArray.length; i++) {
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
          setDate();
          displayWeather();
        });
    });
}
function celsiusToFar(temp) {
  return temp * 1.8 + 32;
}
// wait
tempElement.forEach(function(el, index) {
  el.addEventListener("click", function() {
    if (refArray[index][1].temperature.value === undefined) return;
    if (refArray[index][1].temperature.unit == "celsius") {
      let far = Math.floor(celsiusToFar(refArray[index][1].temperature.value));
      let farMax = Math.floor(
        celsiusToFar(refArray[index][1].temperature.temp_max)
      );
      let farMin = Math.floor(
        celsiusToFar(refArray[index][1].temperature.temp_min)
      );
      tempElement[index].innerHTML = `${far}°<span>F</span>`;
      maxTemp[
        index
      ].innerHTML = `<span>Maximum</span> ${farMax}°<span>C</span>`;
      minTemp[
        index
      ].innerHTML = `<span>Minimum</span> ${farMin}°<span>C</span>`;
      refArray[index][1].temperature.unit = "fahrenheit";
    } else {
      tempElement[index].innerHTML = `${
        refArray[index][1].temperature.value
      }°<span>C</span>`;
      maxTemp[index].innerHTML = `<span>Maximum</span> ${
        refArray[index][1].temperature.temp_max
      }°<span>C</span>`;
      minTemp[index].innerHTML = `<span>Minimum</span> ${
        refArray[index][1].temperature.temp_min
      }°<span>C</span>`;
      refArray[index][1].temperature.unit = "celsius";
    }
  });
});
