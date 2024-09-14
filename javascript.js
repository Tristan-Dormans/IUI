function loadPantry() {
    const pantryList = document.querySelector('#pantryList');
    pantryList.innerHTML = ''; // Clear existing items
  
    fetch('./pantry.txt') // Replace 'pantry.txt' with your file name
      .then(response => response.text())
      .then(data => {
        const items = data.split('\n');
        items.forEach(item => {
          if (item.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            pantryList.appendChild(listItem);
          }
        });
      })
      .catch(error => {
        console.error('Error loading pantry items:', error);
        const errorItem = document.createElement('li');
        errorItem.textContent = 'Error loading pantry items!';
        pantryList.appendChild(errorItem);
      });
  }