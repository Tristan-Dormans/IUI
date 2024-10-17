const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
const calendarBody = document.getElementById('calendar-body');
const monthYear = document.getElementById('month-year');

const urlParams = new URLSearchParams(window.location.search);
const url = window.location.href;

if (url.includes("?")) {
    const dateParam = extractLastTenChars(url);
    const [day, month, year] = dateParam.split('/');
    const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`;
    currentDate = new Date(formattedDate);
}

function extractLastTenChars(str) {
    str = String(str);
    if (str.length < 10) {
      return str;
    }
    return str.slice(-10);
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        calendarBody.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-date');
        dayDiv.textContent = day;

        if (day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()) {
            dayDiv.classList.add('current-date');
        }

        const anchorTag = document.createElement('a');
        const formattedDate = `${day < 10 ? '0' + day : day}/${(month + 1) < 10 ? '0' + (month + 1) : (month + 1)}/${year}`;
        anchorTag.href = `day.html?${formattedDate}`;
        anchorTag.appendChild(dayDiv);

        const eventList = document.createElement('ul');
        eventList.classList.add('event-list');
        
        const eventDate = formatDate(year, month + 1, day);
        
        const eventsForDay = getEventsForDay(formattedDate);
        eventsForDay.forEach(event => {
            const eventItem = document.createElement('li');
            const startTimeFormatted = formatTime(event.startTime);
            const endTimeFormatted = formatTime(event.endTime);
            eventItem.textContent = `${event.name} (${event.recipe}) (${startTimeFormatted} - ${endTimeFormatted})`;
            eventList.appendChild(eventItem);
        });
        anchorTag.appendChild(eventList);

        calendarBody.appendChild(anchorTag);
    }
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

function formatTime(time) {
    return time < 10 ? `0${time}:00` : `${time}:00`;
}

function formatDate(year, month, day) {
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${formattedMonth}/${formattedDay}/${year}`;
}

function getEventsForDay(dateString) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    return events.filter(event => event.date === dateString);
}

window.onload = function () {
    renderCalendar(currentDate);
};
