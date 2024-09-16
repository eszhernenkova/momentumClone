document.addEventListener('DOMContentLoaded', () => {
    const weatherBlock = document.getElementById('weather-block');
    const todoList = document.getElementById('todo-list');
    const todoToggle = document.getElementById('todo-toggle');
    const backgroundSlider = document.getElementById('background-slider');

    const apiKey = "6784be0ca773a4f9d5d6f512f033dd17";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

    
    const searchBox = document.querySelector(".search input"); 
    const searchBtn = document.querySelector(".search button");
    const weatherIcon = document.querySelector(".weather-icon");
    
    const weatherStorageKey = 'weatherData';

    const defaultCity = "Краснодар";

    async function cherWeather(city) {
        const response = await fetch(apiUrl + city +`&appid=${apiKey}`);
        if(response.status == 404){
            document.querySelector(".error").style.display="block";
            document.querySelector(".weather").style.display="none";
        } else {
            const data = await response.json();
    
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp ) + "°c";
    
            if(data.weather[0].main == "Clouds"){
                weatherIcon.src = "images/clouds.png"
            } else if(data.weather[0].main == "Clear"){
                weatherIcon.src = "images/clear.png"
            } else if(data.weather[0].main == "Rain"){
                weatherIcon.src = "images/rain.png"
            } else if(data.weather[0].main == "Drizzle"){
                weatherIcon.src = "images/drizzle.png"
            } else if(data.weather[0].main == "Mist"){
                weatherIcon.src = "images/mist.png"
            }
    
            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display="none";
        } 
    }

    cherWeather(defaultCity);

    // function loadWeatherFromLocalStorage() {
    //     const storedWeatherData = localStorage.getItem(weatherStorageKey);
        
    //     if (storedWeatherData) {
    //         const data = JSON.parse(storedWeatherData);
    //         displayWeather(data);
    //     } else {
    //         fetchWeather(defaultCity);
    //     }
    // }
    
    // // Отобразить погоду для города по умолчанию при загрузке страницы
    // loadWeatherFromLocalStorage();
    
    weatherBlock.addEventListener('click', (event) => {
        if (event.target !== searchBox && event.target !== searchBtn) {
            if (weatherBlock.classList.contains('collapsed')) {
                weatherBlock.classList.remove('collapsed');
                weatherBlock.classList.add('expanded');
                document.querySelector(".search").style.display = "flex"; // Показываем инпут
            } else {
                weatherBlock.classList.remove('expanded');
                weatherBlock.classList.add('collapsed');
                document.querySelector(".search").style.display = "none"; // Скрываем инпут
            }
        }
    });
    
    searchBtn.addEventListener("click", ()=>{
        console.log('Search button clicked');
        cherWeather(searchBox.value);
    });
    
    document.addEventListener('keyup', function(event){
       if(event.code === 'Enter'){
            cherWeather(searchBox.value);
       }
    })

    todoToggle.addEventListener('click', () => {
        if (todoList.classList.contains('collapsed')) {
            todoList.classList.remove('collapsed');
            todoList.classList.add('expanded');
        } else {
            todoList.classList.remove('expanded');
            todoList.classList.add('collapsed');
        }
    });

    function updateDateTime() {
        const now = new Date();
        const dateTime = document.getElementById('date-time');
        dateTime.textContent = now.toLocaleString();
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    function updateBackground() {
        const now = new Date();
        const hours = now.getHours();
        let backgroundImage = '';

        if (hours >= 0 && hours < 6) {
            backgroundImage = 'url(images/01.jpg)';
        } else if (hours >= 6 && hours < 12) {
            backgroundImage = 'url(images/02.jpg)';
        } else if (hours >= 12 && hours < 18) {
            backgroundImage = 'url(images/03.jpg)';
        } else {
            backgroundImage = 'url(images/04.jpg)';
        }

        backgroundSlider.style.backgroundImage = backgroundImage;
    }


    updateBackground();

    setInterval(updateBackground, 3600000); 
});
