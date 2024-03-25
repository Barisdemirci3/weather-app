const API_KEY = "32fb26b56705b2e631c63ce39ec84aff";
var JsonData = {};

function error(text) {
    Swal.fire({
        title: 'Hata!',
        text: `${text}`,
        icon: 'error',
        confirmButtonText: 'Tamam'
    })
}
function KelvinToCelsius(kelvin) {
    return Math.floor(kelvin - 273.15);
}
function ShowDatas() {
    $('#weather-info').removeClass('d-none'); // 'd-none' sınıfını kaldır
        $('#weather-info').addClass('d-block');
        var city_name = $('#city_name');
        var temp = $('#temperature');
        var desc = $('#description');
        var humidity = $('#humidity');
        var wind_speed = $('#wind-speed');
        var weather_icon = $('#weather-icon');
        city_name.text(city);
        temp.text(JsonData.temp);
        desc.text(JsonData.weather_description);
        humidity.text(JsonData.humidty);
        wind_speed.text(JsonData.wind_speed);
        weather_icon.attr('src', `https://openweathermap.org/img/wn/${JsonData.icon}@4x.png`);
  }
function GetWeatherFromGeo(lat,lon){
    return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`).then((response) => {
        if(response.status != 200){
            throw new Error('Can not connected to API!');
        }
        return response.json();
    }).then((data) => {
       JsonData = {
            temp: KelvinToCelsius(data.current.temp),
            humidty: data.current.humidity,
            wind_speed: data.current.wind_speed,
            weather_description: data.current.weather[0].description,
            icon: data.current.weather[0].icon
        }
        ShowDatas();
    }).catch((er) => {
        throw new Error(er);
    })
}
function GetCityGEO(city){
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`).then((response) => {
        if (!response.status == 200) {
            throw new Error("API not connected.");
        }
        return response.json()
    })
}
$('#use_current_location').click(() => {
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((positions) => {
        lat = positions.coords.latitude;
        lon = positions.coords.longitude;
        GetWeatherFromGeo(lat,lon);
    });
}
})
function GetWeatherData(city) {
   GetCityGEO(city).then((data) => {
        let lat, lon;
        lat = data[0].lat
        lon = data[0].lon
        console.log(lat,lon)
    })
}
$("#weather_app").submit((e, city) => {
    e.preventDefault();
    city = $("#city").val().trim();
    if (city == "") {
        return error("Please enter a city name!");
    }
    GetWeatherData(city);
});
