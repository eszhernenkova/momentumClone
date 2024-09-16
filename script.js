document.addEventListener('DOMContentLoaded', () => {
    const weatherBlock = document.getElementById('weather-block');
    const todoList = document.getElementById('todo-list');
    const weatherIcon = document.getElementById('weather-icon');
    const todoToggle = document.getElementById('todo-toggle');
    const backgroundSlider = document.getElementById('background-slider');
    
    weatherBlock.addEventListener('click', () => {
        if (weatherBlock.classList.contains('collapsed')) {
            weatherBlock.classList.remove('collapsed');
            weatherBlock.classList.add('expanded');
        } else {
            weatherBlock.classList.remove('expanded');
            weatherBlock.classList.add('collapsed');
        }
    });

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
