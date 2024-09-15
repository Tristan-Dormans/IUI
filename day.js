// Get the date from the URL
const urlParams = new URLSearchParams(window.location.search);
const date = extractLastTenChars(window.location.href)

// Set the date in the header
document.getElementById('date').textContent = date;

// Create the hours
// Create the hours
for (let i = 0; i < 24; i++) {
    const hour = document.createElement('div');
    hour.textContent = `${i}:00`;
    hour.className = 'hour';

    // Create an event container for this hour
    const eventContainer = document.createElement('div');
    eventContainer.className = 'event-container';

    // Load the events from local storage
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Filter events for this hour
    const eventsForHour = events.filter(e => e.hour === i.toString());

    // Display events for this hour
    eventsForHour.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.style.backgroundColor = event.color;
        eventDiv.innerHTML = `<span>${event.name}</span> - ${event.recipe}`;
        eventContainer.appendChild(eventDiv);
    });

    // Append both hour and events to the main container
    document.getElementById('hours').appendChild(hour);
    document.getElementById('hours').appendChild(eventContainer);
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
    const hour = document.getElementById('hour').value;

    // Create a new event object
    const event = {
        date: date,
        name: eventName,
        recipe: recipe,
        color: color,
        hour: hour
    };

    // Load the events from local storage
    let events = JSON.parse(localStorage.getItem('events')) || [];

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
            eventDiv.innerHTML = `<span>${event.name}</span> - ${event.recipe} - ${event.hour}:00`;
            eventsDiv.appendChild(eventDiv);
        }
    });
});

// Create the hours dropdown menu
const hourSelect = document.getElementById('hour');
for (let i = 0; i < 24; i++) {
  const hourOption = document.createElement('option');
  hourOption.value = i;
  hourOption.textContent = `${i}:00`;
  hourSelect.appendChild(hourOption);
}