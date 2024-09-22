

document.addEventListener('DOMContentLoaded', () => {
    const weatherBlock = document.getElementById('weather-block');
    const todoList = document.getElementById('todo-list');
    const todoToggle = document.getElementById('todo-toggle');
    const backgroundSlider = document.getElementById('background-slider');

    const apiKey = "6784be0ca773a4f9d5d6f512f033dd17";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

    const search = document.querySelector('.search');
    const searchContent = document.querySelector('.search__content');
    const openSearchButton = document.querySelector(".open-search");
    
    // const searchBox = document.querySelector(".search input"); 
    const searchBox = searchContent.querySelector('input'); 
    const searchBtn = document.querySelector(".search__content button");
    const weatherIcon = document.querySelector(".weather-icon");



    const defaultCity = "Краснодар";


    const inputBox = document.getElementById("input-box");
    const listConteiner = document.getElementById("list-conteiner");

    async function cherWeather(city) {
        try {
            const response = await axios.get(`${apiUrl}${city}&appid=${apiKey}`);
            const data = response.data;
    
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    
            if (data.weather[0].main === "Clouds") {
                weatherIcon.src = "images/clouds.png";
            } else if (data.weather[0].main === "Clear") {
                weatherIcon.src = "images/clear.png";
            } else if (data.weather[0].main === "Rain") {
                weatherIcon.src = "images/rain.png";
            } else if (data.weather[0].main === "Drizzle") {
                weatherIcon.src = "images/drizzle.png";
            } else if (data.weather[0].main === "Mist") {
                weatherIcon.src = "images/mist.png";
            }
    
            const weatherElement = document.querySelector(".weather");
            weatherElement.style.display = "flex";
            weatherElement.style.alignItems = "center";
            weatherElement.style.justifyContent = "space-around";
            document.querySelector(".error").style.display = "none";
    
            saveData();
        } catch (error) {
            if (error.response && error.response.status === 404) {
                document.querySelector(".error").style.display = "block";
                document.querySelector(".weather").style.display = "none";
            } else {
                console.error("Ошибка при получении данных о погоде:", error);
            }
        }
    }


    weatherBlock.addEventListener('click', (event) => {

        if (event.target !== search && event.target !== openSearchButton && event.target !== searchBox) {
            if (weatherBlock.classList.contains('collapsed')) {
                weatherBlock.classList.remove('collapsed');
                weatherBlock.classList.add('expanded');
    
                search.style.display = "flex"; 
                document.querySelector(".weather").style.display = "flex";
            } else {
                weatherBlock.classList.remove('expanded');
                weatherBlock.classList.add('collapsed');
                search.style.display = "none"; 
                document.querySelector(".weather").style.display = "flex"; 
            }
        }
    });


    // weatherBlock.addEventListener('click', (event) => {
    //     if (event.target !== searchBox && event.target !== openSearchButton ) {
    //         if (weatherBlock.classList.contains('collapsed')) {
    //             weatherBlock.classList.remove('collapsed');
    //             weatherBlock.classList.add('expanded');

    //             document.querySelector(".search").style.display = "flex";
    //             document.querySelector(".search__content").style.display = "flex";
    //             document.querySelector(".weather").style.display = "flex";

    //         } else {
    //             weatherBlock.classList.remove('expanded');
    //             weatherBlock.classList.add('collapsed');
    //             document.querySelector(".search").style.display = "none";
    //             document.querySelector(".weather").style.display = "flex"; 
    //         }
    //     }
    // });

    openSearchButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        if (searchContent.style.display === "flex") {
            searchContent.style.display = "none"; 
        } else {
            searchContent.style.display = "flex"; 
        }
    });
    
    function saveData() {
        const city = document.querySelector(".city").innerHTML;

        localStorage.setItem("city", city);
    }

    function loadData() {
        const savedCity = localStorage.getItem("city");
    
        if (savedCity) {
            cherWeather(savedCity);
        } else {
            cherWeather(defaultCity);
        }
    }

    window.addEventListener('load', loadData);

    searchBtn.addEventListener("click", ()=>{
        cherWeather(searchBox.value);
        
    });

    searchBox.addEventListener('keyup', function(event) {
        if (event.code === 'Enter' && searchBox.value.trim() !== "") {
            cherWeather(searchBox.value);
            event.preventDefault(); 
            event.stopPropagation(); 
        }
    });
    

    cherWeather(defaultCity);



    todoToggle.addEventListener('click', (event) => {

        event.stopPropagation();

        if (todoList.classList.contains('collapsed')) {
            todoList.classList.remove('collapsed');
            todoList.classList.add('expanded');
        } else {
            todoList.classList.remove('expanded');
            todoList.classList.add('collapsed');
        }
    });

    todoList.addEventListener('click', (event) => {

        if (event.target.tagName === 'SPAN') {
            const taskItem = event.target.closest('li');
            if (taskItem) {
                taskItem.remove();
                event.stopPropagation(); 
            }
        }
    });

    document.addEventListener('click', (event) => {
        const isClickInsideToggle = todoToggle.contains(event.target);
        const isClickInsideList = todoList.contains(event.target);

        if (!isClickInsideToggle && !isClickInsideList) {
            
            if (todoList.classList.contains('expanded')) {
                todoList.classList.remove('expanded');
                todoList.classList.add('collapsed');
            }
        }
    });


    function addTask() {
        if(inputBox.value === ''){
            alert("Напишите что-то");
        } else {
            let li = document.createElement("li");
            li.innerHTML = inputBox.value;
            listConteiner.appendChild(li);
            let span = document.createElement("span");
            span.innerHTML = "\u00d7";
            li.appendChild(span);
        }
    
        inputBox.value = '';
        ToDo();
    }

    inputBox.addEventListener('keyup', function(event) {
        if (event.code === 'Enter' && inputBox.value.trim() !== "") {
            addTask();
            event.preventDefault(); 
            event.stopPropagation(); 
        }
    });
    
    listConteiner.addEventListener("click", function(e) {
        if(e.target.tagName === "LI"){
            e.target.classList.toggle("checked");
            ToDo();
        } else if (e.target.tagName === "SPAN") {
            e.target.parentElement.remove();
            ToDo();
        }
    }, false);

    document.addEventListener('keyup', function(event){
        if (event.code === 'Enter') {
            
            if (document.activeElement === searchBox && searchBox.value.trim() !== "") {
                cherWeather(searchBox.value); 
            } else if (document.activeElement === inputBox && inputBox.value.trim() !== "") {
                addTask(); 
            }
        }
    });
    
    
    function ToDo(){
        localStorage.setItem("data", listConteiner.innerHTML);
    }
    
    function showTask(){
        listConteiner.innerHTML = localStorage.getItem("data");
    }
    
    showTask();


    function updateDateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
        const dayOfWeek = days[now.getDay()];
        const dayOfMonth = now.getDate();
        const month = months[now.getMonth()];

        const dateString = `${dayOfMonth} ${month}, ${dayOfWeek}`;


        const dateTime = document.getElementById('date-time');
        dateTime.innerHTML = `<div>${timeString}</div><div>${dateString}</div>`;
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




