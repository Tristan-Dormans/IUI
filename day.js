const urlParams = new URLSearchParams(window.location.search);
const date = extractLastTenChars(window.location.href);

document.getElementById('date').textContent = date;

for (let i = 0; i < 24; i++) {
    const hourContainer = document.createElement('div');
    hourContainer.style.display = 'flex';
    hourContainer.style.alignItems = 'center';
    hourContainer.style.padding = '10px';
    hourContainer.style.borderBottom = '1px solid #ccc';

    const hour = document.createElement('div');
    hour.textContent = `${i}:00`;
    hour.style.width = '50px';
    hour.style.textAlign = 'center';
    hour.style.fontWeight = 'bold';
    hourContainer.appendChild(hour);

    const eventContainer = document.createElement('div');
    eventContainer.style.flexGrow = '1';
    eventContainer.style.paddingLeft = '20px';

    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Filtering events for the current hour block 'i'
    const eventsForHour = events.filter(e => {
        const eventStartTime = parseInt(e.startTime, 10);
        const eventEndTime = parseInt(e.endTime, 10);
        
        // Show events that start at 'i' or overlap into 'i' but do not end at 'i'
        return eventStartTime <= i && eventEndTime > i && e.date === extractLastTenChars(window.location.href);
    });

    // Rendering the filtered events with delete (X) button
    eventsForHour.forEach((event, eventIndex) => {
        const eventDiv = document.createElement('div');
        eventDiv.style.backgroundColor = event.color;
        eventDiv.style.padding = '5px';
        eventDiv.style.borderRadius = '5px';
        eventDiv.style.marginTop = '5px';
        eventDiv.style.width = 'calc(50% - 5px)';
        eventDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        eventDiv.style.position = 'relative';  // To position the X button

        const eventText = document.createElement('span');
        eventText.textContent = `${event.name} - ${event.recipe}`;
        eventText.style.display = 'inline-block';
        eventText.style.marginRight = '10px';
        eventText.style.fontWeight = 'bold';

        const timeSpan = document.createElement('span');
        timeSpan.textContent = `${event.startTime}:00 - ${event.endTime}:00`;
        timeSpan.style.display = 'inline-block';
        timeSpan.style.color = '#666';

        // X button to remove the event
        const deleteButton = document.createElement('span');
        deleteButton.textContent = 'X';
        deleteButton.style.color = '#ff0000';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.position = 'absolute';
        deleteButton.style.top = '5px';
        deleteButton.style.right = '10px';
        deleteButton.addEventListener('click', () => {
            removeEvent(event);  // Call remove event function when X is clicked
        });

        // Append event details and delete button to eventDiv
        eventDiv.appendChild(eventText);
        eventDiv.appendChild(timeSpan);
        eventDiv.appendChild(deleteButton);
        eventContainer.appendChild(eventDiv);
    });

    hourContainer.appendChild(eventContainer);
    document.getElementById('hours').appendChild(hourContainer);
}

// Function to remove event from localStorage
function removeEvent(eventToRemove) {
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Filter out the event to be removed
    events = events.filter(event => {
        return !(event.date === eventToRemove.date && 
                 event.startTime === eventToRemove.startTime && 
                 event.endTime === eventToRemove.endTime && 
                 event.name === eventToRemove.name);
    });

    // Save the updated events back to localStorage
    localStorage.setItem('events', JSON.stringify(events));

    // Reload the page or re-render the events
    location.reload();  // Reload to reflect the changes in the DOM
}




let recipes = [];
fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
        recipes = data;
        const recipeSelect = document.getElementById('recipe');
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.name;
            option.textContent = recipe.name;
            recipeSelect.appendChild(option);
        });
    });

function extractLastTenChars(str) {
    str = String(str);
    if (str.length < 10) {
        return str;
    }
    return str.slice(-10);
}

function calculateBusyHours(events) {
    let busyHours = 0;
    events.forEach(event => {
        if (event.date === date) {
            busyHours += event.endTime - event.startTime;
        }
    });
    return busyHours;
}

function suggestRecipe(busyHours) {
  let freeHours = 24 - busyHours;

  // Retrieve pantry data from local storage
  const storedPantryData = JSON.parse(localStorage.getItem("pantryData"));
  const pantry = storedPantryData.shelves.reduce((acc, shelf) => {
    return acc.concat(shelf.items.map(item => item.name));
  }, []);

  const suitableRecipes = recipes.filter(recipe => {
    const hasIngredients = recipe.ingredients.every(ingredient => pantry.includes(ingredient));
    return hasIngredients && recipe.cooking_time <= freeHours * 60;
  });

  suitableRecipes.sort((a, b) => b.cooking_time - a.cooking_time);

  return suitableRecipes.length > 0 ? suitableRecipes[0] : null;
}

document.getElementById('generate-recipe').addEventListener('click', (e) => {
    e.preventDefault();

    let events = JSON.parse(localStorage.getItem('events')) || [];

    const busyHours = calculateBusyHours(events);

    const suggestedRecipe = suggestRecipe(busyHours);

    if (suggestedRecipe) {
        // Set the recipe in the form
        document.getElementById('recipe').value = suggestedRecipe.name;

        // Set the start time and end time (assuming we add it at the first available hour)
        let startTime = document.getElementById('start-time').value;
        let endTime = String(parseInt(startTime) + Math.ceil(suggestedRecipe.cooking_time / 60));

        // Automatically fill the other fields if needed (name, color, etc.)
        // Now, add this suggested recipe to the schedule
        const newEvent = {
            date: date,
            name: `Cooking:`,
            recipe: suggestedRecipe.name,
            color: '#4CAF50',
            startTime: startTime,
            endTime: endTime,
            reminderDate: date // You can customize this as needed Math.ceil(suggestedRecipe.cooking_time / 60),
        };

        // Save the event to localStorage
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));

        // Update the displayed schedule
        const eventsDiv = document.getElementById('events');
        eventsDiv.innerHTML = '';
        events.forEach(event => {
            if (event.date === date) {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                eventDiv.style.backgroundColor = event.color;
                eventDiv.innerHTML = `<span>${event.name}</span> - ${event.recipe} - ${event.startTime}:00 - ${event.endTime}:00`;
                eventsDiv.appendChild(eventDiv);
            }
        });

        alert(`Suggested Recipe: ${suggestedRecipe.name} (Cooking time: ${suggestedRecipe.cooking_time} minutes) added to your schedule.`);
        location.reload()
    } else {
        alert('No suitable recipe found for the available time.');
    }
});

document.getElementById('add-event').addEventListener('click', (e) => {
    e.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const recipe = document.getElementById('recipe').value;
    const color = document.getElementById('color').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const reminderDate = document.getElementById('reminder-date').value;

    const event = {
        date: date,
        name: eventName,
        recipe: recipe,
        color: color,
        startTime: startTime,
        endTime: endTime,
        reminderDate: reminderDate
    };

    let events = JSON.parse(localStorage.getItem('events')) || [];

    events.push(event);

    localStorage.setItem('events', JSON.stringify(events));

    const eventsDiv = document.getElementById('events');
    eventsDiv.innerHTML = '';
    events.forEach(event => {
        if (event.date === date) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.style.backgroundColor = event.color;
            eventDiv.innerHTML = `<span>${event.name}</span> - ${event.recipe} - ${event.startTime}:00 - ${event.endTime}:00`;
            eventsDiv.appendChild(eventDiv);
        }
    });
    location.reload();
});

const startTimeSelect = document.getElementById('start-time');
for (let i = 0; i < 24; i++) {
    const startTimeOption = document.createElement('option');
    startTimeOption.value = i;
    startTimeOption.textContent = `${i}:00`;
    startTimeSelect.appendChild(startTimeOption);
}

const endTimeSelect = document.getElementById('end-time');
for (let i = 0; i < 24; i++) {
    const endTimeOption = document.createElement('option');
    endTimeOption.value = i;
    endTimeOption.textContent = `${i}:00`;
    endTimeSelect.appendChild(endTimeOption);
}
