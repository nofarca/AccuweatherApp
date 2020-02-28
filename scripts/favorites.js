var citySearchDictionary = [];
// var currentCity;

function clickAddToFavoriets() {
    debugger;
    $("#heart").click(function() {
        if ($("#heart").hasClass("liked")) {
            checkFavorite(currentCity);
        } else {
            checkFavorite(currentCity);
        }
    });
}


//remove from favorite : includeArr boolean meanse i need to remove from the array 
function removeFavorite(includeArr = false, temparr) {
    if (includeArr) { temparr[favorite] = false; }
    $("#heart").html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
    $("#heart").removeClass("liked");
};

function checkFavorite(currentCity) {
    try {
        let errorFavoriets = true;
        /**assume city in the citySearchDictionary*/
        for (var dicIndex in citySearchDictionary) {
            if (citySearchDictionary[dicIndex][`${currentCity}`]) {
                errorFavoriets = false;
                if (citySearchDictionary[dicIndex].favorite == false) {
                    addFavorite(currentCity);
                } else {
                    removeFavorite(true, citySearchDictionary[dicIndex]);
                }
            }
        }
        if (errorFavoriets) {
            alert('Please search before add to favorites ');
            $("#heart").html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
            $("#heart").removeClass("liked");
        }
    } catch (e) {
        ErrorEvent(e);
    }
};

//after Add to favorites
function displayFavorites(cityDetails, weatherInfo) {

    //cloneWeatherDiv
    let newClass = cityDetails.EnglishName.replace(/\s/g, '');
    let startNode = document.querySelector('.startFavorites');
    let weatherContainer = document.querySelector('.toCopy');
    // weatherContainer.classList.remove(`.toCopy`);

    if ($('.weather-container-favorite').find($(`.${newClass}`)).length > 0) {
        console.log(`${newClass} is exists`);
    } else {

        console.log(`just added ${newClass}`);
        let copy = weatherContainer.cloneNode(true);
        copy.classList.add(newClass);
        startNode.appendChild(copy);

        //add the class name for all the dom children
        $('div', `div.${newClass}`).each(function(index) {
            $(this).addClass(`${newClass}`);
            $(this).removeClass(`.toCopy`);
        });
    }

    displayFavoritesWeather(cityDetails, weatherInfo);
}

function displayFavoritesWeather(cityDetails, weatherInfo) {
    let cityClass = cityDetails.EnglishName.replace(/\s/g, '');
    let favoritesTempElement = document.querySelector(`.${cityClass} .temperature-value-favorite p`);
    let favoritesDescElement = document.querySelector(`.${cityClass} .temperature-description-favorite p`);
    let favoritesLocationElement = document.querySelector(`.${cityClass} .location-favorite p`);
    let favoritesfavoritesWeatherIcon = document.querySelector(`.${cityClass} .weather-icon-favorite`);


    let tempDate = `${weatherInfo.LocalObservationDateTime.slice(0,10)}`;
    var parts = tempDate.split('-');
    let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
    let dayName = mydate.toString().split(' ')[0];

    //date and day
    let weatherElement = document.querySelector(`.${cityClass} p`);
    weatherElement.innerHTML = `${dayName} ${mydate.toLocaleDateString('en-GB')}`;

    //icon
    currentPage = location.href.split("/").slice(-1)[0];
    if (currentPage == 'favorites.html') {
        favoritesfavoritesWeatherIcon.innerHTML = "<img src=\"../icons/" + updateIcon(weatherInfo) + ".png\"/>";
    } else {
        favoritesfavoritesWeatherIcon.innerHTML = "<img src=\"icons/" + updateIcon(weatherInfo) + ".png\"/>";
    }
    //temperature
    favoritesTempElement.innerHTML = "<span>" + Math.round(weatherInfo.Temperature.Metric.Value) + "</span> <span>&deg;C</span>";
    //description
    favoritesDescElement.innerHTML = `<div class="my-3">${weatherInfo.WeatherText}</div>`;
    //location
    favoritesLocationElement.innerHTML = `${cityDetails.EnglishName}, ${cityDetails.Country.EnglishName}`;

}