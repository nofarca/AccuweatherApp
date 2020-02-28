const key = 'GsqjcHtv0dw4iWTFhD6nNbt3HQGopw3O';
// var currentCity;

async function getWeather(id) {
    const baseUrl = 'https://dataservice.accuweather.com/currentconditions/v1/';
    const query = `${id}?apikey=${key}`
    const response = await fetch(baseUrl + query);
    debugger;
    const data = await response.json();
    return data[0];


    // debugger;
    // var str = "jsonFiles/currentCondition.json";
    // currentPage = location.href.split("/").slice(-1);
    // var response;
    // if (currentPage == 'favorites.html') {
    //     response = await fetch(`..\/${str}`);
    // } else {
    //     response = await fetch(str);
    // }
    // const data = await response.json();
    // return data[0];

};

async function getCity(city) {
    // debugger;
    const baseUrl = 'https://dataservice.accuweather.com/locations/v1/cities/search';
    const query = `?apikey=${key}&q=${city}&details=true&metric=true`;
    const response = await fetch(baseUrl + query);
    const data = await response.json();
    return (data[0]);
    // debugger;
    // var str = "jsonFiles/search_city.json";
    // currentPage = location.href.split("/").slice(-1);
    // var response;
    // if (currentPage == 'favorites.html') {
    //     response = await fetch(`..\/${str}`);
    // } else {
    //     response = await fetch(str);
    // }
    // const data = await response.json();
    // return data[0];
};


async function getFutureWeather(id) {

    const baseUrl = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
    const query = `${id}?apikey=${key}&details=true`;
    const response = await fetch(baseUrl + query);
    debugger;
    const data = await response.json();
    return data;
    // debugger;
    // var str = "jsonFiles/weathercity.json";
    // currentPage = location.href.split("/").slice(-1);
    // var response;
    // if (currentPage == 'favorites.html') {
    //     response = await fetch(`..\/${str}`);
    // } else {
    //     response = await fetch(str);
    // }
    // const data = await response.json();
    // return data;
};


async function updateCity(city) {

    const cityDetails = await getCity(city);
    const weatherInfo = await getWeather(cityDetails.Key);
    const weatherFutureInfo = await getFutureWeather(cityDetails.Key);
    try {
        currentCity = cityDetails.EnglishName != '' ? cityDetails.EnglishName : currentCity;

        let addToDict = (citySearchDictionary.length == 0) ? true : false;

        //check if city already exsist case when dictonery.lenght grater then 0 
        if (!addToDict) {
            addToDict = true; // assume that the city is not in the dictonery 

            Object.keys(citySearchDictionary).forEach(function(dicIndex) {
                if (citySearchDictionary[dicIndex][`${cityDetails.EnglishName}`] == cityDetails.Key) { addToDict = false; }
            });
        }

        //add to the dictonery new city
        if (addToDict == true) {
            citySearchDictionary.push({
                favorite: false,
                // cityName: cityDetails.EnglishName,
                // cityKey: cityDetails.Key,
                [cityDetails.EnglishName]: cityDetails.Key,
                //cityDetails: cityDetails,
                //weatherInfo: weatherInfo,

            });
        }
        displayWeather(cityDetails, weatherInfo);
        displayWeeklyWeather(cityDetails, weatherFutureInfo);
        //displayWeeklyWeatherJSONFile(cityDetails, weatherFutureInfo);
        // localStorage.setItem('citySearchDictionary', citySearchDictionary);

    } catch (e) {
        alert(`updateCity Error: ${e}`);
    }
};



async function addFavorite() {
    try {
        $("#heart").html('<i class="fa fa-heart" aria-hidden="true"></i>');
        $("#heart").addClass("liked");
        debugger;

        // move on all city the user search
        for (var dicIndex in citySearchDictionary) {

            if (citySearchDictionary[dicIndex][`${currentCity}`]) {

                let dictVal_CityKey = citySearchDictionary[dicIndex][`${currentCity}`];
                let dictVal_CityName = getKeyFromVal(dictVal_CityKey, citySearchDictionary[dicIndex]);

                console.log(`citySearchDictionary[${dicIndex}].favorite: ${citySearchDictionary[dicIndex].favorite}`);
                console.log(`citySearchDictionary[${dicIndex}].dictVal_CityName: ${dictVal_CityName}`);
                console.log(`citySearchDictionary[${dicIndex}].dictVal_CityKey: ${dictVal_CityKey}`);

                debugger;
                let favoCityDetails = await getCity(dictVal_CityName);
                let favoWeatherInfo = await getWeather(dictVal_CityKey);


                //need to figure  on who we click like
                console.log(citySearchDictionary[dicIndex][`${currentCity}`]);
                console.log(`citySearchDictionary[dicIndex].favorite: ${citySearchDictionary[dicIndex].favorite}`);

                if (!citySearchDictionary[dicIndex].favorite) { citySearchDictionary[dicIndex].favorite = true; }

                displayFavorites(favoCityDetails, favoWeatherInfo);
            }
        }
    } catch (e) {
        alert("addFavorite Error:" + e);
    }

};