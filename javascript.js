currentWeekNumber = 10

function getCurrentWeek() {
  const today = new Date();
  const firstDayOfWeek = today.getDate() - today.getDay() + 1;
  const lastDayOfWeek = firstDayOfWeek + 6;
  const weekNumber = currentWeekNumber; // Use the currentWeekNumber variable
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + i + (weekNumber - 1) * 7);
    weekDates.push(date.toLocaleDateString());
  }

  return { weekNumber, weekDates };
}

function updateCalendar() {
  const { weekNumber, weekDates } = getCurrentWeek();
  const scheduleGrid = document.querySelector('.schedule-grid');
  const dayElements = scheduleGrid.children;
  let events = JSON.parse(localStorage.getItem('events')) || [];
  clearDayHeaders(dayElements);

  for (let i = 0; i < 7; i++) {
    const dayElement = dayElements[i];
    const dayHeader = dayElement.querySelector('h3');
    const dayDate = weekDates[i];
    dayHeader.textContent = dayDate; // Set the text content to only the new date

    // Create a new <a> tag
    const anchorTag = document.createElement('a');
    anchorTag.href = `./day.html?${dayHeader.textContent.toLowerCase().replace(" ","").replace(" ","")}`;

    // Get the parent element of the <h3> element
    const parentElement = dayHeader.parentNode;

    // Wrap the <h3> element with the new <a> tag
    parentElement.replaceChild(anchorTag, dayHeader);
    anchorTag.appendChild(dayHeader);

    // Display events for this day
    const eventsForDay = events.filter(event => event.date === dayHeader.textContent.toLowerCase().replace(" ","").replace(" ",""));
    const eventList = document.createElement('ul');
    eventList.style.fontSize = '0.8em'; // Reduce font size
    eventsForDay.forEach(event => {
      const eventItem = document.createElement('li');
      const startTime = event.startTime; // Assuming startTime is in 24-hour format (e.g. "14")
      const endTime = event.endTime; // Assuming endTime is in 24-hour format (e.g. "15")
      const startTimeFormatted = `${startTime < 10 ? '0' + startTime : startTime}:00`; // Format startTime as "HH:00"
      const endTimeFormatted = `${endTime < 10 ? '0' + endTime : endTime}:00`; // Format endTime as "HH:00"
      eventItem.textContent = `${event.name} - ${event.recipe} - ${startTimeFormatted} - ${endTimeFormatted}`; // Show start and end times
      eventList.appendChild(eventItem);
    });
    dayElement.appendChild(eventList);
}

  const weekHeader = document.querySelector('h2');
  weekHeader.textContent = `Your Weekly Schedule - Week ${weekNumber}`;
}

function clearDayHeaders(dayElements) {
  Array.from(dayElements).forEach(dayElement => {
    const dayHeader = dayElement.querySelector('h3');
    dayHeader.textContent = ''; // Clear the text content
    const anchorTag = dayHeader.parentNode;
    if (anchorTag.tagName === 'A') {
      anchorTag.parentNode.replaceChild(dayHeader, anchorTag); // Remove the <a> tag
    }
    const eventList = dayElement.querySelector('ul');
    if (eventList) {
      dayElement.removeChild(eventList); // Remove the event list
    }
  });
}

function goToNextWeek() {
  currentWeekNumber++;
  updateCalendar();
}

function goToPreviousWeek() {
  console.log("test")
  currentWeekNumber--;
  updateCalendar();
}

window.onload = function () {
  updateCalendar();
  document.getElementById("next-week").addEventListener('click', goToNextWeek);
  document.getElementById("prev-week").addEventListener('click', goToPreviousWeek);
}