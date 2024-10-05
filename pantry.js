const pantryData = {
    "shelves": [
      {
        "id": 1,
        "items": [
          {"id": 1, "name": "Chicken"},
          {"id": 2, "name": "Carrots"},
          {"id": 3, "name": "Celery"},
          {"id": 4, "name": "Onion"}
        ]
      },
      {
        "id": 2,
        "items": [
          {"id": 5, "name": "Chicken Broth"},
          {"id": 6, "name": "Chickpeas"},
          {"id": 7, "name": "Tahini"},
          {"id": 8, "name": "Lemon Juice"}
        ]
      },
      {
        "id": 3,
        "items": [
          {"id": 9, "name": "Garlic"},
          {"id": 10, "name": "Bread"},
          {"id": 11, "name": "Flour"},
          {"id": 12, "name": "Sugar"}
    //             {"id": 13, "name": "Chicken Breast"},

    // {"id": 14, "name": "Olive Oil"},

    // {"id": 15, "name": "Salt"},

    // {"id": 16, "name": "Pepper"}
        ]
      }
    ]
  };
  localStorage.setItem('pantryData', JSON.stringify(pantryData));

  // Retrieve data from local storage
  const storedPantryData = JSON.parse(localStorage.getItem('pantryData'));

  // Create shelves and items dynamically
  const shelvesContainer = document.getElementById('shelves');
  storedPantryData.shelves.forEach((shelf, index) => {
    const shelfElement = document.createElement('div');
    shelfElement.className = 'shelf';
    shelvesContainer.appendChild(shelfElement);

    shelf.items.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'item';
      itemElement.textContent = item.name;
      shelfElement.appendChild(itemElement);
    });
  });