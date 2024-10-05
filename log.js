let logEvents = [];

function logEvent(event) {
  let logMessage = {
    type: event.type,
    target: event.target.tagName + '#' + event.target.id,
    coordinates: `(${event.clientX}, ${event.clientY})`,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  logEvents.push(logMessage);

  // Store the log events in local storage
  localStorage.setItem('logEvents', JSON.stringify(logEvents));
}

// Load the log events from local storage when the page loads
document.addEventListener('DOMContentLoaded', function() {
  const storedLogEvents = localStorage.getItem('logEvents');
  if (storedLogEvents) {
    logEvents = JSON.parse(storedLogEvents);
  }

  // Register event listeners for the first time the page has been loaded
  const urlName = window.location.href;
  logEvent({ type: 'DOMContentLoaded', target: 'document', clientX: 0, clientY: 0});
});

// Register event listeners for button clicks
document.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    logEvent(event);
  }
});

document.addEventListener('change', function(event) {
    if (event.target.tagName === 'SELECT') {
      logEvent(event);
    }
  });

// Register event listeners for dropdown menu clicks
document.addEventListener('click', function(event) {
  if (event.target.tagName === 'SELECT') {
    logEvent(event);
  }
});

// Register event listeners for link clicks
document.addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
    logEvent(event);
  }
});

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'INPUT' && event.target.type === 'text') {

        logEvent(event);
    
      }
  });