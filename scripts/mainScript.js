const cityForm = document.querySelector('form');

const weatherIcon = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

const details = document.querySelector('.details');

const favoriteElement = document.querySelector("#Favorite");
const homeElement = document.querySelector("#Home");
var hasCodeRunBefore = false;
var clickSearch = false;
var citySearchDictionary = [];
var currentCity = '';

function showTab(evt, currentTab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(currentTab).style.display = "block";
    evt.currentTarget.className += " active";
};


// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();



///
window.addEventListener("load", function() {
    // initial with Tel Aviv weather information for the first time
    if (hasCodeRunBefore == false) {
        init();

        hasCodeRunBefore = true;
    }
});

//click on search new city
cityForm.addEventListener('submit', function(e) {
    debugger;
    try {
        clickSearch = true;
        e.preventDefault();
        let city = cityForm.city.value.trim();
        removeFavorite(false);
        cityForm.reset();
        currentCity = (currentCity == '' || currentCity != city) ? 'Tel-Aviv' : currentCity;
        debugger;

        updateCity(city);

    } catch (e) {
        alert("Submit Error: " + e);
    }
}, false);

//remove like sign on new search
cityForm.addEventListener('reset', function(e) {
    try {
        e.preventDefault();
        if ($("#heart").hasClass("liked")) {
            for (var dicIndex in citySearchDictionary) {
                if (citySearchDictionary[dicIndex][`${currentCity}`]) {
                    if (citySearchDictionary[dicIndex].favorite == false) {
                        if ($("#heart").hasClass("liked")) {
                            $("#heart").html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
                            $("#heart").removeClass("liked");
                        }
                    } else if (citySearchDictionary[dicIndex].favorite == true) {
                        if ($("#heart").hasClass("liked")) {
                            $("#heart").html('<i class="fa fa-heart" aria-hidden="true"></i>');
                            $("#heart").addClass("liked");
                        }
                    }
                }
            }
        }

    } catch (e) {
        alert("Reset Error: " + e);
    }
});

// on page load
function init(city = 'Tel-Aviv') {
    updateCity(city);
};



// by clicking on the navigation bar 
function switchSection(type) {
    debugger;
    switch (type) {
        case "HOME":
            showHome();
            break;

        case 'FAVORITE':
            showFavorites();
            break;

    }

};

/*Decoration Function*/
function showHome() {
    debugger;
    favoriteElement.style.display = "none"; //hide
    favoriteElement.style.visibility = 'hidden'; //hide

    homeElement.style.display = "block";
    homeElement.style.visibility = 'visible';
};

function showFavorites() {

    homeElement.style.visibility = 'hidden'; //hide

    favoriteElement.style.display = "block"; //hide
    favoriteElement.style.visibility = 'visible'; //hide
};

//get information from displayWeather function
const setBackground = (boolDay) => {
    let dayOrNight = boolDay ? 'DAY' : 'NIGHT';
    if (dayOrNight == 'DAY') {
        $('#fullImage').addClass('day').removeClass('night');
    } else {
        $('#fullImage').addClass('night').removeClass('day');
    }
};


function updateIcon(weatherInfo) {
    let imgSrc = null;
    if (weatherInfo.WeatherIcon != null) {
        weatherInfo.IsDayTime ? imgSrc = `${weatherInfo.WeatherIcon}-s` : imgSrc = `${weatherInfo.WeatherIcon}-s`;
    } else {
        imgSrc = 'unknown';
    }
    return imgSrc;
};

//show current weather of current city 
function displayWeather(cityDetails, weatherInfo) {

    debugger;
    let tempDate = `${weatherInfo.LocalObservationDateTime.slice(0,10)}`;
    var parts = tempDate.split('-');
    let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
    let dayName = mydate.toString().split(' ')[0];

    setBackground(weatherInfo.IsDayTime);

    //date and day
    let weatherElement = document.querySelector(`.weatherForm .app-title p`);
    weatherElement.innerHTML = `${dayName} ${mydate.toLocaleDateString('en-GB')}`;

    debugger;
    //icon
    currentPage = location.href.split("/").slice(-1)[0];
    if (currentPage == 'favorites.html') {
        weatherIcon.innerHTML = "<img src=\"../icons/" + updateIcon(weatherInfo) + ".png\"/>";
    } else {
        weatherIcon.innerHTML = "<img src=\"icons/" + updateIcon(weatherInfo) + ".png\"/>";
    }
    //temperature
    tempElement.innerHTML = "<span>" + Math.round(weatherInfo.Temperature.Metric.Value) + "</span> <span>&deg;C</span>";
    //description
    descElement.innerHTML = `<div class="my-3">${weatherInfo.WeatherText}</div>`;
    //location
    locationElement.innerHTML = `${cityDetails.EnglishName}, ${cityDetails.Country.EnglishName}`;

}

//show 5 days weather of current city
function displayWeeklyWeather(cityDetails, weatherFutureInfo) {

    debugger;
    let dailyForecasts = typeof(weatherFutureInfo["DailyForecasts"]) === "undefined" ? (weatherFutureInfo[0].DailyForecasts) : (weatherFutureInfo["DailyForecasts"]);
    for (i = 0; i < dailyForecasts.length; ++i) {

        let week = ['first', 'second', 'third', 'fourth', 'fifth'];
        let WeeklyElement = document.querySelector(`.${week[i]} .date`);
        let dailyForecast = dailyForecasts[i];
        let currentPage = location.href.split("/").slice(-1)[0];

        //date
        let tempDate = `${dailyForecast.Date.slice(0,10)}`;
        let parts = tempDate.split('-');
        let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        let dayName = mydate.toString().split(' ')[0];

        WeeklyElement.innerHTML = `${dayName} <br> ${mydate.toLocaleDateString('en-GB')}`;

        //image
        WeeklyElement = document.querySelector(`.${week[i]} .weather-icon`);
        if (currentPage == 'favorites.html') {
            WeeklyElement.innerHTML = "<img src=\"../icons/" + `${dailyForecast.Day.Icon}-s` + ".png\"/>";
        } else {
            WeeklyElement.innerHTML = "<img src=\"icons/" + `${dailyForecast.Day.Icon}-s` + ".png\"/>";
        }

        //temperatureMin
        let temperatureMin = celciusToFahrenhet(dailyForecast.Temperature.Minimum.Unit, dailyForecast.Temperature.Minimum.Value);
        WeeklyElement = document.querySelector(`.${week[i]} .temperatureMin`);
        WeeklyElement.innerHTML = `<strong>Min Temp:</strong> ${temperatureMin} <span>&deg;C</span> `;


        //temperatureMax
        let temperatureMax = celciusToFahrenhet(dailyForecast.Temperature.Maximum.Unit, dailyForecast.Temperature.Maximum.Value);
        WeeklyElement = document.querySelector(`.${week[i]} .temperatureMax`);
        WeeklyElement.innerHTML = `<strong>Max Temp:</strong> ${temperatureMax} <span>&deg;C</span>`;

        //description
        WeeklyElement = document.querySelector(`.${week[i]} .temperature-description`);
        WeeklyElement.innerHTML = ` ${dailyForecast.Day.IconPhrase}`;

        //location
        WeeklyElement = document.querySelector(`.${week[i]} .location`);
        WeeklyElement.innerHTML = `${cityDetails.EnglishName}, ${cityDetails.Country.EnglishName}`;
    }
}


// in case we want information in json file attached to the json Files library instead of connect to API
function displayWeeklyWeatherJSONFile(cityDetails, weatherFutureInfo) {
    debugger;
    try {
        for (i = 0; i < weatherFutureInfo[0].DailyForecasts.length; ++i) {


            let week = ['first', 'second', 'third', 'fourth', 'fifth'];
            let temp = `.${week[i]} .date`;
            let WeeklyElement = document.querySelector(temp);
            let dailyForecasts = weatherFutureInfo[0].DailyForecasts[i];
            let currentPage = location.href.split("/").slice(-1)[0];

            //date    
            let tempDate = `${dailyForecasts.Date.slice(0,10)}`;
            let parts = tempDate.split('-');
            let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
            let dayName = mydate.toString().split(' ')[0];

            WeeklyElement.innerHTML = `${dayName} <br> ${mydate.toLocaleDateString('en-GB')}`;

            //image
            WeeklyElement = document.querySelector(`.${week[i]} .weather-icon`);
            if (currentPage == 'favorites.html') {
                WeeklyElement.innerHTML = "<img src=\"../icons/" + `${dailyForecasts.Day.Icon}-s` + ".png\"/>";
            } else {
                WeeklyElement.innerHTML = "<img src=\"icons/" + `${dailyForecasts.Day.Icon}-s` + ".png\"/>";
            }

            //temperatureMin
            WeeklyElement = document.querySelector(`.${week[i]} .temperatureMin`);
            WeeklyElement.innerHTML = `<strong>Min Temp:</strong> ${dailyForecasts.Temperature.Minimum.Value} <span>&deg;C</span> `;

            //temperatureMax
            WeeklyElement = document.querySelector(`.${week[i]} .temperatureMax`);
            WeeklyElement.innerHTML = `<strong>Max Temp:</strong> ${dailyForecasts.Temperature.Maximum.Value} <span>&deg;C</span>`;

            //description
            WeeklyElement = document.querySelector(`.${week[i]} .temperature-description`);
            WeeklyElement.innerHTML = ` ${dailyForecasts.Day.IconPhrase}`;

            //location
            WeeklyElement = document.querySelector(`.${week[i]} .location`);
            WeeklyElement.innerHTML = `${cityDetails.EnglishName}, ${cityDetails.Country.EnglishName}`;
        }
    } catch (e) {
        alert("displayWeeklyWeatherJSONFile Error:" + e);
    }
}



//claculation
function celciusToFahrenhet(unit, degree) {
    if (unit == "C") {
        return parseInt(Math.round(degree * 9 / 5 + 32));
    } else {
        return parseInt(Math.round(degree - 32) * 5 / 9);
    }
};

//get key from city dictionary
function getKeyFromVal(val, arr) {
    debugger;
    for (let arr_key in arr) {
        if (arr[arr_key] == val) {
            return arr_key;
        }
    }
    return false;
};