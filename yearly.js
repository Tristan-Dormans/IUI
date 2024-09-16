// Array of month names
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Select the container div
const container = document.querySelector('.container');

// Loop through the months array and create elements
months.forEach((month, index) => {
  const monthDiv = document.createElement('div');
  monthDiv.classList.add('month');
  monthDiv.textContent = month;

  // Add an event listener to handle clicks
  monthDiv.addEventListener('click', () => {
    // Get the current year
    const year = new Date().getFullYear();

    // Get the day of the month (1-31)
    const day = new Date(year, index, 1).getDate();

    // Format the date string as dd/mm/yyyy
    const date = `${day < 10 ? `0${day}` : day}/${index + 1 < 10 ? `0${index + 1}` : index + 1}/${year}`;

    // Navigate to the monthly.html page with the date string as a parameter
    window.location.href = `./monthly.html?${date}`;
  });

  // Append each month div to the container
  container.appendChild(monthDiv);
});