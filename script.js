

document.addEventListener('DOMContentLoaded', () => {

    const backgroundSlider = document.getElementById('background-slider');
    const inputBox = document.getElementById("input-box");
    const listConteiner = document.getElementById("list-conteiner");
    const todoList = document.getElementById('todo-list');
    const todoToggle = document.getElementById('todo-toggle');
    const weatherBlock = document.getElementById('weather-block');
    const apiKey = "6784be0ca773a4f9d5d6f512f033dd17";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

    const search = document.querySelector('.search');
    const searchContent = document.querySelector('.search__content');
    const openSearchButton = document.querySelector(".search__target_open-search");
    const searchBox = searchContent.querySelector('input');
    const targetElement = document.querySelector('.search__target');
    const closeSearchButton = document.querySelector('.search__cross');
    const defaultCity = "Краснодар";



 // получение данных 

    async function cherWeather(city) {
        try {
            const response = await axios.get(`${apiUrl}${city}&appid=${apiKey}`);
            console.log("Данные о погоде  в основном: ", response.data);
            return response.data; 
            

        } catch (error) {
            if (error.response && error.response.status === 404) {
                document.querySelector(".error").style.display = "block";
                document.querySelector(".weather").style.display = "none";
            } else {
                console.error("Ошибка при получении данных о погоде:", error);
            }
            return null; //  в случае ошибки
        }
    }


    
    
    function updateWeatherElement(element, data) {
        try {
            console.log("Обновление клона элемента погоды с данными:", data);

            const mainWeatherElement = document.querySelector(".weather");
            if (!mainWeatherElement) {
                console.error("Элемент погоды не найден."); 
                return; 
}

            if (!data || !data.name || !data.main || !data.weather || !data.weather[0]) {
                console.error('Некорректные данные:', data);
                return;
            }

            const cityElement = element.querySelector(".city");
            const tempElement = element.querySelector(".temp");
        
            if (cityElement) {
                cityElement.innerHTML = data.name;
            } else {
                console.error("Элемент для города не найден.");
            }
        
            if (tempElement) {
                tempElement.innerHTML = Math.round(data.main.temp) + "°C";
            } else {
                console.error("Элемент для температуры не найден.");
            }
    
            element.querySelector(".city").innerHTML = data.name;
            element.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    
            const weatherIcon = element.querySelector(".weather-icon");
            const weatherArray = data.weather;
    
            if (weatherArray && weatherArray.length > 0) {
                const weatherCondition = weatherArray[0].main;

                if (weatherCondition === "Clouds") {
                    weatherIcon.src = "images/clouds.png";
                } else if (weatherCondition === "Clear") {
                    weatherIcon.src = "images/clear.png";
                } else if (weatherCondition === "Rain") {
                    weatherIcon.src = "images/rain.png";
                } else if (weatherCondition === "Drizzle") {
                    weatherIcon.src = "images/drizzle.png";
                } else if (weatherCondition === "Mist") {
                    weatherIcon.src = "images/mist.png";
                } else {
                    weatherIcon.src = "images/default.png";
                }
    

            } else {
                console.error('Нет данных о погоде в массиве:', weatherArray);
            }
        } catch (error) {
            console.error("Ошибка при обновлении элемента погоды:", error);
        }
    }

  
    // обновление или создание клонированного элемента внутри блока search
    async function updateWeather(city) {
        console.log(`Обновление погоды для города: ${city}`);
        const weatherData = await cherWeather(city); // Получаем данные о погоде
    
        if (weatherData) {
            const mainWeatherElement = document.querySelector(".weather");
            // обновить основной элемент погоды
            updateWeatherElement(mainWeatherElement, weatherData);
    
            // обновить клонированный элемент
            updateSearchWeather(weatherData);
    
            saveData(city);  

        } else {
            console.error("Не удалось получить данные о погоде."); 
        }
    }

    function updateSearchWeather(data) {
        let clonedElement = targetElement.querySelector('.weather');

        if (clonedElement) {
            clonedElement.remove();
        }
    
        // клонировать основной элемент погоды
        const mainWeatherElement = document.querySelector(".weather");
        const newClonedElement = mainWeatherElement.cloneNode(true);
    
        // обновить информацию в клонированном элементе
        updateWeatherElement(newClonedElement, data);
    
        // добавить клонированный элемент внутрь блока поиска
        targetElement.appendChild(newClonedElement);
    }
    

    searchBox.addEventListener('keydown', function(event) {

        if (event.code === 'Enter' && searchBox.value.trim() !== "") {
            const city = searchBox.value.trim();
            console.log("Запрос погоды для города:", city);
            
            updateWeather(city);
            cherWeather(city);

            event.preventDefault();
            event.stopPropagation();
        } 
    });

    cherWeather(defaultCity);

    

    weatherBlock.addEventListener('click', (event) => {
        event.stopPropagation();
        const clonedElement = targetElement.querySelector('.weather');
        
        if (weatherBlock.classList.contains('collapsed')) {
            weatherBlock.classList.remove('collapsed');
            weatherBlock.classList.add('expanded');
            
            // проверка на существование клонированного элемента
            if (!clonedElement) {
                const mainWeatherElement = document.querySelector(".weather");
                const newClonedElement = mainWeatherElement.cloneNode(true);
                targetElement.appendChild(newClonedElement);
            }

            search.style.display = "flex";
            targetElement.style.order = "2";
        } else {
            weatherBlock.classList.remove('expanded');
            weatherBlock.classList.add('collapsed');
            search.style.display = "none";
        }
    });


    document.addEventListener('click', (event) => {
        
        if (!weatherBlock.contains(event.target) && !searchContent.contains(event.target)) {
            weatherBlock.classList.remove('expanded');
            weatherBlock.classList.add('collapsed');
            search.style.display = "none";
        }
    });

   
    searchContent.addEventListener('click', (event) => {
        event.stopPropagation(); 
    });

    openSearchButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        searchContent.style.display = "flex"; 
        searchContent.style.position = "absolute"; 
        searchContent.style.zIndex = 2; 
    });

    closeSearchButton.addEventListener('click', () => {
        searchContent.style.display = "none";
    });


    function saveData() {
        const city = document.querySelector(".city").innerHTML;
        localStorage.setItem("city", city);
    }


    function loadData() {
        const savedCity = localStorage.getItem("city");
        console.log("Загруженный город из localStorage:", savedCity);
        if (savedCity) {
            updateWeather(savedCity);  
        } else {
            updateWeather(defaultCity);  
        }
    }

    window.addEventListener('load', loadData);

   







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
