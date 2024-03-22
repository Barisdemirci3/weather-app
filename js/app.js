function error(text) {
    Swal.fire({
        title: 'Hata!',
        text: `${text}`,
        icon: 'error',
        confirmButtonText: 'Tamam'
    })
}

const API_KEY = "32fb26b56705b2e631c63ce39ec84aff";
var JsonData = {};
function KelvinToCelsius(kelvin) {
    return Math.floor(kelvin - 273.15);
}
function GetWeatherData(city) {
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`).then((response) => {
        if (!response.status == 200) {
            throw new Error("API'a bağlanılamadı");
        }
        return response.json()
    }).then((data) => {
        let lat, lon;
        lat = data[0].lat
        lon = data[0].lon
        return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=tr`).then((response) => {
            if (!response.status == 200) {
                throw new Error("API'a bağlanılamadı");
            }
            return response.json();
        }).then((data) => {
            return data;
        })
    }).catch((er) => {
        error("Lütfen geçerli bir şehir ismi giriniz!");
        throw new Error(er);
    })
}
$("#weather_app").submit((e, city) => {
    e.preventDefault();
    city = $("#city").val().trim();
    if (city == "") {
        return error("Hava durumunu sorgulamak için şehir kısmını doldurmalısınız!");
    }
    GetWeatherData(city).then((data) => {
        console.log(data);
        JsonData = {
            temp: KelvinToCelsius(data.current.temp),
            humidty: data.current.humidity,
            wind_speed: data.current.wind_speed,
            weather_description: data.current.weather[0].description,
            icon: data.current.weather[0].icon
        }
        $('#weather-info').removeClass('d-none'); // 'd-none' sınıfını kaldır
        $('#weather-info').addClass('d-block');
        console.log(JsonData)
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


    });
});

