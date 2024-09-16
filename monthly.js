const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
const calendarBody = document.getElementById('calendar-body');
const monthYear = document.getElementById('month-year');

// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const url = window.location.href;

// Extract the date from the URL parameters
if (url.includes("?")) {
    const dateParam = extractLastTenChars(url);
    const [day, month, year] = dateParam.split('/');
    const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`;
    currentDate = new Date(formattedDate);
  }


function extractLastTenChars(str) {
    // Ensure the input is a string
    str = String(str);
    
    // Check if the string has at least 10 characters
    if (str.length < 10) {
      return str; // Return the entire string if it's shorter than 10 chars
    }
    
    // Extract the last 10 characters
    return str.slice(-10);
  }


// Function to render the calendar for the current month
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Clear previous calendar body
    calendarBody.innerHTML = '';

    // Fill in previous month's empty slots
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        calendarBody.appendChild(emptyDiv);
    }

    // Fill in current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-date');
        dayDiv.textContent = day;

        // Highlight today's date
        if (day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()) {
            dayDiv.classList.add('current-date');
        }

        // Create a link to day.html
        const anchorTag = document.createElement('a');
        const formattedDate = `${day < 10 ? '0' + day : day}/${(month + 1) < 10 ? '0' + (month + 1) : (month + 1)}/${year}`;
        anchorTag.href = `day.html?${formattedDate}`;
        anchorTag.appendChild(dayDiv);

        // Add event list for each day
        const eventList = document.createElement('ul');
        eventList.classList.add('event-list');
        
        // Format the date to "MM/DD/YYYY" to match the event data
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

// ... rest of the code remains the same ...

// Event listeners for month navigation
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Utility function to format time
function formatTime(time) {
    return time < 10 ? `0${time}:00` : `${time}:00`;
}

// Utility function to format the date as MM/DD/YYYY
function formatDate(year, month, day) {
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${formattedMonth}/${formattedDay}/${year}`;
}

// Function to get events for a specific day
function getEventsForDay(dateString) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    return events.filter(event => event.date === dateString);
}

// Initialize calendar on page load
window.onload = function () {

    // Store the sample events in localStorage if it's not already there
    if (!localStorage.getItem('events')) {
        localStorage.setItem('events', JSON.stringify(sampleEvents));
    }

    renderCalendar(currentDate);
};
