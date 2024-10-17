const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const container = document.querySelector('.container');

months.forEach((month, index) => {
  const monthDiv = document.createElement('div');
  monthDiv.classList.add('month');
  monthDiv.textContent = month;

  monthDiv.addEventListener('click', () => {
    const year = new Date().getFullYear() + 1;
    const day = new Date(year, index, 1).getDate();
    const date = `${day < 10 ? `0${day}` : day}/${index + 1 < 10 ? `0${index + 1}` : index + 1}/${year}`;
    window.location.href = `./monthly.html?${date}`;
  });

  container.appendChild(monthDiv);
});
