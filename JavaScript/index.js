let searchInput = document.getElementById('search');

let today = document.getElementById('today');
let dayNum = document.getElementById('dayNum');
let month = document.getElementById('month');
let locationElement = document.getElementById('locationElement');
let temp = document.getElementById('temp');
let weatherImg = document.getElementById('weatherImg');
let weatherText = document.getElementById('weatherText');
let curHumidity = document.getElementById('curHumidity');
let windSpeed = document.getElementById('windSpeed');
let windDirection = document.getElementById('windDirection');

let nextDays = document.querySelectorAll('.nextDay');
let nextWeatherImgs = document.querySelectorAll('.nextWeatherImg');
let maxDegs = document.querySelectorAll('.maxDeg');
let minDegs = document.querySelectorAll('.minDeg');
let nextWeatherTexts = document.querySelectorAll('.nextWeatherText');

document.addEventListener('DOMContentLoaded', (event) => {
    let header = document.querySelector('.header');
    let text = document.querySelector('.text');
    let startImg = document.querySelector('.start-img');

    function displayHeaderDelayed() {
        setTimeout(function() {
            if (header) {
                header.classList.remove('d-none');
                header.classList.add('show-header');
            }
        }, 7000);
    }

    displayHeaderDelayed();
    fire();
});

async function getData(lat, lon) {
    let weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=71dbd040c45b418aa92175158231802&q=${lat},${lon}&days=3`);
    let weatherData = await weatherResponse.json();
    return weatherData;
}

function displayTodaysData(data) {
    let todaysDate = new Date();
    today.innerHTML = todaysDate.toLocaleDateString("en-US", { weekday: "long" });

    let day = todaysDate.getDate();
    if (day === 1 || day === 21 || day === 31) {
        dayNum.innerHTML = day + "st of";
    } else if (day === 2 || day === 22) {
        dayNum.innerHTML = day + "nd of";
    } else if (day === 3 || day === 23) {
        dayNum.innerHTML = day + "rd of";
    } else {
        dayNum.innerHTML = day + "th of";
    }

    month.innerHTML = todaysDate.toLocaleDateString("en-US", { month: "short" });

    locationElement.innerHTML = data.location.name;
    temp.innerHTML = data.current.temp_c + "°C";
    weatherImg.setAttribute("src", "https:" + data.current.condition.icon);
    weatherText.innerHTML = data.current.condition.text;
    curHumidity.innerHTML = data.current.humidity + "%";
    windSpeed.innerHTML = " " + data.current.wind_kph + " km/h";
    windDirection.innerHTML = " " + data.current.wind_dir;
}

function displayNextData(data) {
    if (!data) return;

    let forecastData = data.forecast.forecastday;
    for (let i = 0; i < 2; i++) {
        let nextDate = new Date(forecastData[i + 1].date);
        nextDays[i].innerHTML = nextDate.toLocaleDateString("en-US", { weekday: "long" });
        maxDegs[i].innerHTML = forecastData[i + 1].day.maxtemp_c + '°C';
        minDegs[i].innerHTML = forecastData[i + 1].day.mintemp_c + '°C';
        nextWeatherImgs[i].setAttribute("src", "https:" + forecastData[i + 1].day.condition.icon);
        nextWeatherTexts[i].innerHTML = forecastData[i + 1].day.condition.text;
    }
}

async function fire(city="Alexandria") {
    if (city) {
        let weatherData = await getData(city);
        if (!weatherData.error) {
            displayTodaysData(weatherData);
            displayNextData(weatherData);
        }
    } else {
        getUserLocation();
    }
}

async function fireByCoords(lat, lon) {
    let weatherData = await getData(lat, lon);
    if (!weatherData.error) {
        displayTodaysData(weatherData);
        displayNextData(weatherData);
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fireByCoords(latitude, longitude);
        }, (error) => {
            console.error("Error getting location: ", error);
            fire("Alexandria");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        fire("Alexandria");
    }
}

searchInput.addEventListener('input', function() {
    fire(searchInput.value);
});
