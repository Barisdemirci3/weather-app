const API_KEY = "32fb26b56705b2e631c63ce39ec84aff";

function KelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

function GetWeatherData(city) {
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("API'YE BAĞLANILAMADI!");
            }
            return response.json();
        }).then((geoData) => {
            const lat = geoData[0].lat;
            const lon = geoData[0].lon;

            return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=tr`);
        }).then((weatherResponse) => {
            if (!weatherResponse.ok) {
                throw new Error("API'YE BAĞLANILAMADI!");
            }
            return weatherResponse.json();
        }).then((weatherData) => {
            const description = weatherData.current.weather[0].description;
            const temp = KelvinToCelsius(weatherData.current.temp);
            const humidity = weatherData.current.humidity;
            return {
                description,
                temp,
                humidity
            };
        }).catch((error) => {
            console.error(error);
            return null;
        });
}

$("#weather_app").submit((e) => {
    e.preventDefault();
    const city = $("#city").val().trim();
    if (city === "") {
        alert("Lütfen bir şehir ismi giriniz!");
        return;
    }
    GetWeatherData(city).then((data) => {
        console.log(data);
    });
});
