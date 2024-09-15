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
  
      // Create the date string in the format dd/mm/yyyy
      const date = `${index + 1 < 10 ? `0${index + 1}` : index + 1}/${new Date(year, index, 1).getDate()}/${year}`;
  
      // Navigate to the monthly.html page with the date string as a parameter
      window.location.href = `./monthly.html?date=${date}`;
    });
  
    // Append each month div to the container
    container.appendChild(monthDiv);
  });