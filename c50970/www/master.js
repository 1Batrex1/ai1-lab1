const apiKey = "24fe27b9cf67b55095f9a18ee2f4c351";

function findLocation() {
  let locationData = document.getElementById("address").value.split(" ");
  document.getElementById(
    "city"
  ).innerHTML = `Pogoda w mieście ${locationData[1]}`;
  document.getElementById("weatherContainer").innerHTML = "";
  let location = fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q="${locationData[1]},${locationData[0]} "&limit=1&appid=${apiKey}`
  );
  location
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let lat = data[0].lat;
      let lon = data[0].lon;
      getCurrentWeather(lat, lon).then((xhr) => {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            let result = JSON.parse(xhr.responseText);
            createWeatherBlock(
              new Date(result.dt * 1000),
              result.main.temp,
              result.main.feels_like,
              result.weather[0].icon,
              result.weather[0].description
            );
          }
        };
      });
      getForecastForNextDays(lat, lon)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          for (let weather of data.list) {
            createWeatherBlock(
              new Date(weather.dt * 1000),
              weather.main.temp,
              weather.main.feels_like,
              weather.weather[0].icon,
              weather.weather[0].description
            );
          }
        });
    });
}

function createWeatherBlock(
  dateString,
  temp,
  feelsTemperature,
  icon,
  description
) {
  const weatherBlock = document.createElement("div");
  weatherBlock.className = "weatherBlock";

  const dateBlock = document.createElement("div");
  dateBlock.className = "dateBlock";
  dateBlock.innerHTML = `${dateString.toLocaleDateString()} ${dateString.toLocaleTimeString()}`;
  weatherBlock.appendChild(dateBlock);

  const temperatureBlock = document.createElement("div");
  temperatureBlock.className = "temperatureBlock";
  temperatureBlock.innerHTML = `${temp}°C`;
  weatherBlock.appendChild(temperatureBlock);

  const feelsTemperatureBlock = document.createElement("div");
  feelsTemperatureBlock.className = "feelsTemperatureBlock";
  feelsTemperatureBlock.innerHTML = `Feels like ${feelsTemperature}°C`;
  weatherBlock.appendChild(feelsTemperatureBlock);

  const iconBlock = document.createElement("img");
  iconBlock.className = "iconBlock";
  iconBlock.src = `http://openweathermap.org/img/w/${icon}.png`;
  weatherBlock.appendChild(iconBlock);

  const descriptionBlock = document.createElement("div");
  descriptionBlock.className = "descriptionBlock";
  descriptionBlock.innerHTML = description;
  weatherBlock.appendChild(descriptionBlock);

  let weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.appendChild(weatherBlock);
}

async function getCurrentWeather(lat, lon) {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    true
  );
  xhr.send();
  return xhr;
}

async function getForecastForNextDays(lat, lon) {
  return await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
}
