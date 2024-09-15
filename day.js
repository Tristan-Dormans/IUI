// Get the date from the URL
const urlParams = new URLSearchParams(window.location.search);
const date = extractLastTenChars(window.location.href)

// Set the date in the header
document.getElementById('date').textContent = date;

for (let i = 0; i < 24; i++) {
    const hourContainer = document.createElement('div');
    hourContainer.style.display = 'flex';
    hourContainer.style.alignItems = 'center';
  
    const hour = document.createElement('div');
    hour.textContent = `${i}:00`;
    hour.style.width = '50px';
    hour.style.textAlign = 'center';
    hourContainer.appendChild(hour);
  
    // Create an event container for this hour
    const eventContainer = document.createElement('div');
    eventContainer.style.flexGrow = '1';
  
    // Load the events from local storage
    let events = JSON.parse(localStorage.getItem('events')) || [];
  
    // Filter events for this hour and date
    const eventsForHour = events.filter(e => {
      return (e.startTime <= i && e.endTime !== i && e.endTime >= i) && e.date === extractLastTenChars(window.location.href);
    });
    // Display events for this hour
    eventsForHour.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.style.backgroundColor = event.color;
      eventDiv.style.padding = '5px';
      eventDiv.style.borderRadius = '5px';
      eventDiv.style.marginTop = '5px';
      eventDiv.style.width = 'calc(12% - 50px)';
  
      const eventText = document.createElement('span');
      eventText.textContent = `${event.name} - ${event.recipe}`;
      eventText.style.display = 'inline-block';
      eventText.style.marginRight = '10px';
  
      const timeSpan = document.createElement('span');
      timeSpan.textContent = `${event.startTime}:00 - ${event.endTime}:00`;
      timeSpan.style.display = 'inline-block';
  
      eventDiv.appendChild(eventText);
      eventDiv.appendChild(timeSpan);
      eventContainer.appendChild(eventDiv);
    });
  
    // Append both hour and events to the main container
    hourContainer.appendChild(eventContainer);
    document.getElementById('hours').appendChild(hourContainer);
}

// Load the recipes from the recipes.json file
fetch('recipes.json')
    .then(response => response.json())
    .then(recipes => {
        const recipeSelect = document.getElementById('recipe');
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.name;
            option.textContent = recipe.name;
            recipeSelect.appendChild(option);
        });
    });

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


// Add an event listener to the add event button
document.getElementById('add-event').addEventListener('click', (e) => {
    e.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const recipe = document.getElementById('recipe').value;
    const color = document.getElementById('color').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    // Create a new event object
    const event = {
        date: date,
        name: eventName,
        recipe: recipe,
        color: color,
        startTime: startTime,
        endTime: endTime
    };

    // Load the events from local storage
    let events = JSON.parse(localStorage.getItem('events')) || [];
    console.log(events)

    // Add the event to the events array
    events.push(event);

    // Save the events to local storage
    localStorage.setItem('events', JSON.stringify(events));

    // Reload the events
    const eventsDiv = document.getElementById('events');
    eventsDiv.innerHTML = '';
    events.forEach(event => {
        if (event.date === date) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.style.backgroundColor = event.color;
            eventDiv.innerHTML = `<span>${event.name}</span> - ${event.recipe} - ${event.startTime} - ${event.endTime}`;
            eventsDiv.appendChild(eventDiv);
        }
    });
    location.reload();
});

// Create the start time dropdown menu
const startTimeSelect = document.getElementById('start-time');
for (let i = 0; i < 24; i++) {
  const startTimeOption = document.createElement('option');
  startTimeOption.value = i;
  startTimeOption.textContent = `${i}:00`;
  startTimeSelect.appendChild(startTimeOption);
}

// Create the end time dropdown menu
const endTimeSelect = document.getElementById('end-time');
for (let i = 0; i < 24; i++) {
  const endTimeOption = document.createElement('option');
  endTimeOption.value = i;
  endTimeOption.textContent = `${i}:00`;
  endTimeSelect.appendChild(endTimeOption);
}