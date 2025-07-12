function openFeatures() {
    var allElems = document.querySelectorAll('.elem')
    var fullElemPage = document.querySelectorAll('.fullElem')
    var fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })

    fullElemPageBackBtn.forEach(function (back) {
        back.addEventListener('click', function () {
            fullElemPage[back.id].style.display = 'none'
        })
    })
}

openFeatures()


function todoList() {
    var currentTask = [];

    // Load tasks from localStorage
    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'));
    }

    function renderTask() {
        var allTask = document.querySelector('.allTask');
        if (!allTask) return; // Safety check
        var sum = '';

        // Generate HTML that matches our new CSS structure
        currentTask.forEach(function (elem, idx) {
            sum += `<div class="task">
                <div class="task-content">
                    <h5 class="task-title">${elem.task} <span class="${elem.imp ? 'true' : 'false'}">imp</span></h5>
                    ${elem.details ? `<p class="task-details">${elem.details}</p>` : ''}
                </div>
                <button class="complete-btn" id="${idx}">Mark as Completed</button>
            </div>`;
        });

        allTask.innerHTML = sum;
        localStorage.setItem('currentTask', JSON.stringify(currentTask));
    }

    // Use event delegation for all clicks within the task list
    const todoContainer = document.querySelector('.todo-container');
    if (todoContainer) {
        todoContainer.addEventListener('click', function(event) {
            
            // Logic to show/hide task details by clicking the title
            if (event.target.classList.contains('task-title')) {
                const contentDiv = event.target.closest('.task-content');
                if (contentDiv) {
                    const details = contentDiv.querySelector('.task-details');
                    if (details) {
                        details.classList.toggle('show');
                    }
                }
            }

            // Logic to handle the "Mark as Completed" button
            if (event.target.classList.contains('complete-btn')) {
                const taskIndex = event.target.id;
                currentTask.splice(taskIndex, 1);
                renderTask(); // Re-render the list
            }
        });
    }

    // Initial render when the page loads
    renderTask();

    // Form submission logic
    let form = document.querySelector('.addTask form');
    if(form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let taskInput = document.querySelector('.addTask form #task-input');
            let taskDetailsInput = document.querySelector('.addTask form textarea');
            let taskCheckbox = document.querySelector('.addTask form #check');

            if (!taskInput.value.trim()) return; // Prevent empty tasks

            currentTask.push({
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked
            });

            renderTask();

            // Clear the form
            taskCheckbox.checked = false;
            taskInput.value = '';
            taskDetailsInput.value = '';
        });
    }
}


todoList()


function dailyPlanner() {
    var dayPlanner = document.querySelector('.day-planner')

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var hours = Array.from({ length: 19 }, (_, idx) => `${5 + idx}:00 - ${6 + idx}:00`)


    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {

        var savedData = dayPlanData[idx] || ''

        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
    <p>${elem}</p>
    <input id=${idx} type="text" placeholder="..." value=${savedData}>
</div>`
    })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')

    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            console.log('hello');
            dayPlanData[elem.id] = elem.value

            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}

dailyPlanner()


function motivationalQuote() {
    var motivationQuoteContent = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        let response = await fetch('https://dummyjson.com/quotes/random')
        let data = await response.json()

        motivationQuoteContent.innerHTML = data.quote
        
        motivationAuthor.innerHTML = data.author
    }

    fetchQuote()
}

motivationalQuote()


function pomodoroTimer() {


    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var isWorkSession = true

    let totalSeconds = 25 * 60
    let timerInterval = null

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.innerHTML = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)
        // Add background audio functionality
        let audio = document.querySelector('#pomodoro-audio');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'pomodoro-audio';
            audio.src = 'music.mp3'; // Replace with your audio file path
            audio.loop = true;
            audio.style.display = 'none';
            document.body.appendChild(audio);
        }
        audio.play();
        // Pause audio when pause button is clicked
        pauseBtn.onclick = function() {
            clearInterval(timerInterval);
            audio.pause();
        };
        if (isWorkSession) {

            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--blue)'
                    totalSeconds = 5 * 60
                }
            }, 1000)
        } else {


            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                    totalSeconds = 25 * 60
                }
            }, 1000)
        }

    }

    function pauseTimer() {
        clearInterval(timerInterval)
    }
    function resetTimer() {
        totalSeconds = 25 * 60
        clearInterval(timerInterval)
        updateTimer()

    }
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)



}

pomodoroTimer()



function weatherFunctionality() {


    // I have removed API key for security purpose
    var apiKey = '87cf32deedd9442793a70453250305'
    var city = 'Bhubaneshwar'



    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header1ChangeCity = document.querySelector('.header1 h4')
    var header2Temp = document.querySelector('.header2 h2')
    var header2Condition = document.querySelector('.header2 h4')
    var precipitation = document.querySelector('.header2 .precipitation')
    var humidity = document.querySelector('.header2 .humidity')
    var wind = document.querySelector('.header2 .wind')

    var data = null

    async function weatherAPICall() {
        var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
        data = await response.json()

        header2Temp.innerHTML = `${data.current.temp_c}°C`
        header2Condition.innerHTML = `${data.current.condition.text}`
        wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`
        header1ChangeCity.innerHTML = `<b>${data.location.name}</b>`
        humidity.innerHTML = `Humidity: ${data.current.humidity}%`
        precipitation.innerHTML = `Heat Index : ${data.current.heatindex_c}%`
    }

    weatherAPICall()


    function timeDate() {
        const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var date = new Date()
        var dayOfWeek = totalDaysOfWeek[date.getDay()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = monthNames[date.getMonth()]
        var year = date.getFullYear()

        header1Date.innerHTML = `${tarik} ${month}, ${year}`

        if (hours > 12) {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours - 12).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} PM`

        } else {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} AM`
        }
    }

    setInterval(() => {
        timeDate()
    }, 1000);

}

weatherFunctionality()


function changeTheme() {

    var theme = document.querySelector('.theme')
    var rootElement = document.documentElement

    var flag = 0
    theme.addEventListener('click', function () {

        if (flag == 0) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#222831')
            rootElement.style.setProperty('--tri1', '#948979')
            rootElement.style.setProperty('--tri2', '#393E46')
            flag = 1
        } else if (flag == 1) {
            rootElement.style.setProperty('--pri', '#F1EFEC')
            rootElement.style.setProperty('--sec', '#030303')
            rootElement.style.setProperty('--tri1', '#D4C9BE')
            rootElement.style.setProperty('--tri2', '#123458')
            flag = 2
        } else if (flag == 2) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#381c0a')
            rootElement.style.setProperty('--tri1', '#FEBA17')
            rootElement.style.setProperty('--tri2', '#74512D')
            flag = 0
        }

    })


}

changeTheme()