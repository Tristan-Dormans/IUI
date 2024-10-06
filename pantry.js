const pantryData = {
  "shelves": [
    {
      "id": 1,
      "items": [
        {"id": 1, "name": "Chicken"},
        {"id": 2, "name": "Carrots"},
        {"id": 3, "name": "Celery"},
        {"id": 4, "name": "Onion"},
        {"id": 5, "name": "Chicken Broth"},
        {"id": 6, "name": "Chickpeas"},
        {"id": 7, "name": "Tahini"},
        {"id": 8, "name": "Lemon Juice"},
        {"id": 9, "name": "Garlic"},
        {"id": 10, "name": "Bread"},
        {"id": 11, "name": "Flour"},
        {"id": 12, "name": "Sugar"}
      ]
    },
    {
      "id": 2,
      "items": [
        {"id": 13, "name": "Lasagna Noodles"},
        {"id": 14, "name": "Ground Beef"},
        {"id": 15, "name": "Tomato Sauce"},
        {"id": 16, "name": "Mozzarella Cheese"},
        {"id": 17, "name": "Parmesan Cheese"},
        {"id": 18, "name": "Yogurt"},
        {"id": 19, "name": "Spaghetti"}
      ]
    },
    {
      "id": 3,
      "items": [
        {"id": 20, "name": "Cheese"},
        {"id": 21, "name": "Butter"},
        {"id": 22, "name": "Tortillas"},
        {"id": 23, "name": "Shredded Cheese"},
        {"id": 24, "name": "Lettuce"},
        {"id": 25, "name": "Tomatoes"}
      ]
    },
    {
      "id": 4,
      "items": [
        {"id": 26, "name": "Eggs"},
        {"id": 27, "name": "Milk"},
        {"id": 28, "name": "Chicken Breast"},
        {"id": 29, "name": "Olive Oil"},
        {"id": 30, "name": "Salt"},
        {"id": 31, "name": "Pepper"}
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
