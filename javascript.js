function updateCalendar() {
  const today = new Date();
  const { weekDates } = getCurrentWeek(currentWeekNumber);
  const scheduleGrid = document.querySelector('.schedule-grid');
  const dayElements = scheduleGrid.children;
  let events = JSON.parse(localStorage.getItem('events')) || [];
  clearDayHeaders(dayElements);

  for (let i = 0; i < 7; i++) {
    const dayElement = dayElements[i];
    const dayHeader = dayElement.querySelector('h3');
    const dayDate = weekDates[i];
    dayHeader.textContent = dayDate;

    const anchorTag = document.createElement('a');
    anchorTag.href = `./day.html?${dayHeader.textContent.toLowerCase().replace(/ /g, "")}`;

    const parentElement = dayHeader.parentNode;
    parentElement.replaceChild(anchorTag, dayHeader);
    anchorTag.appendChild(dayHeader);

    const eventsForDay = events.filter(event => event.date === dayHeader.textContent.toLowerCase().replace(/ /g, ""));
    const eventList = document.createElement('ul');
    eventList.classList.add('event-item');
    eventList.style.listStyleType = 'none';
    eventList.style.fontSize = '0.8em';
    eventsForDay.forEach(event => {
      const eventItem = document.createElement('li');
      const startTime = event.startTime;
      const endTime = event.endTime;
      const startTimeFormatted = `${startTime < 10 ? '0' + startTime : startTime}:00`;
      const endTimeFormatted = `${endTime < 10 ? '0' + endTime : endTime}:00`;
      eventItem.textContent = `${event.name} - ${event.recipe} - ${startTimeFormatted} - ${endTimeFormatted}`;
      eventItem.style.backgroundColor = event.color;
      eventItem.style.padding = '5px';
      eventItem.style.borderRadius = '5px';
      eventItem.style.marginTop = '5px';
      eventList.appendChild(eventItem);
    });
    dayElement.appendChild(eventList);
  }

  const weekHeader = document.querySelector('h2');
  weekHeader.textContent = `Your Weekly Schedule - Week ${currentWeekNumber}`;
}

function getCurrentWeek(weekNumber) {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const firstDayOfWeek = getFirstDayOfWeek(new Date(firstDayOfYear.getFullYear(), firstDayOfYear.getMonth(), firstDayOfYear.getDate() + (weekNumber - 1) * 7));

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + i);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    weekDates.push(formattedDate);
  }

  return { weekNumber, weekDates };
}

function getFirstDayOfWeek(date) {
  const dayOfWeek = date.getDay();
  const firstDayOfWeek = new Date(date);
  const dayOffset = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  firstDayOfWeek.setDate(date.getDate() - dayOffset);
  return firstDayOfWeek;
}

function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
}

function clearDayHeaders(dayElements) {
  Array.from(dayElements).forEach(dayElement => {
    const dayHeader = dayElement.querySelector('h3');
    dayHeader.textContent = '';
    const anchorTag = dayHeader.parentNode;
    if (anchorTag.tagName === 'A') {
      anchorTag.parentNode.replaceChild(dayHeader, anchorTag);
    }
    const eventList = dayElement.querySelector('ul');
    if (eventList) {
      dayElement.removeChild(eventList);
    }
  });
}

function checkReminders() {
  const currentTime = new Date();
  const events = JSON.parse(localStorage.getItem('events')) || [];

  events.forEach(event => {
    const reminderDate = new Date(event.reminderDate);
    const reminderTime = reminderDate.getHours() * 60 + reminderDate.getMinutes();
    const currentTimeHour = currentTime.getHours();
    const currentTimeMinute = currentTime.getMinutes();
    const currentDateTime = currentTimeHour * 60 + currentTimeMinute;

    if (reminderDate.getDate() === currentTime.getDate() &&
        reminderDate.getMonth() === currentTime.getMonth() &&
        reminderDate.getFullYear() === currentTime.getFullYear() &&
        reminderTime === currentDateTime) {
      const popupWindow = window.open('', '_blank', 'width=400,height=200');
      const popupHTML = `
        <h2>Reminder: ${event.name}</h2>
        <p>${event.recipe}</p>
        <button onclick="window.close()">Close</button>
      `;
      popupWindow.document.write(popupHTML);
      popupWindow.document.close();
    }
  });
}

setInterval(checkReminders, 5000);

function goToNextWeek() {
  currentWeekNumber++;
  updateCalendar();
}

function goToPreviousWeek() {
  currentWeekNumber--;
  updateCalendar();
}

window.onload = function () {
  const today = new Date();
  currentWeekNumber = getWeekNumber(today);
  updateCalendar();
  document.getElementById("next-week").addEventListener('click', goToNextWeek);
  document.getElementById("prev-week").addEventListener('click', goToPreviousWeek);
}
