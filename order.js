"use strict";
"massive.js";

let order = {
    chicken : null,
    snacks : null,
    drinks : null
};

function total() {
    const price = document.getElementById("total");
    let total = 0;
    if (order.chicken) {
        total += order.chicken.price;
    };
    if (order.snacks) {
        total += order.snacks.price;
    };
    if (order.drinks) {
        total += order.drinks.price;
    };
    price.textContent = `${total}₽`;
}

function update() {
    const none = document.getElementById("nothing");
    const selectedDishes = document.getElementById("selectedDishes");
    
    if (order.chicken || order.snacks || order.drinks) {
        none.style.display = "none";
        selectedDishes.style.display = "flex";
        selectedDishes.style.flexDirection = "column";
        total();
    } else {
        selectedDishes.style.display = "none";
        none.style.display = "block";
    }
}

function setOrder(keyword) {
    const selectedDish = mas.find(dish => dish.keyword === keyword);
    
    if (selectedDish.category === "chicken") {
        order.chicken = selectedDish;
        document.getElementById("noChicken").textContent = 
        selectedDish.name + ' ' + selectedDish.price + '₽';
    }

    if (selectedDish.category === "snacks") {
        order.snacks = selectedDish;
        document.getElementById("noSnacks").textContent =
        selectedDish.name + ' ' + selectedDish.price + '₽';
    }

    if (selectedDish.category === "drinks") {
        order.drinks = selectedDish;
        document.getElementById("noDrinks").textContent =
        selectedDish.name + ' ' + selectedDish.price + '₽';
    }
    update();
}

function dinamicCards() {

    update();

    const sortedDishes = mas.sort((a, b) => a.name.localeCompare(b.name));
    
    const dishSections = document.querySelectorAll('.dishes');
    
    sortedDishes.forEach(dish => {
        const dishCard = document.createElement('div');
        dishCard.classList.add('dish-card');
        dishCard.setAttribute('data-dish', dish.keyword);

        dishCard.innerHTML = 
            `<img src='${dish.image}' alt='${dish.name}'>
            <p class='cost'>${dish.price} ₽</p>
            <p class='name'>${dish.name}</p>
            <p class='gramms'>${dish.count}</p>
            <button>Добавить</button>`;

        if (dish.category === 'chicken') {
            dishSections[0].append(dishCard);
        } else if (dish.category === 'snacks') {
            dishSections[1].append(dishCard);
        } else if (dish.category === 'drinks') {
            dishSections[2].append(dishCard);
        }
       
        dishCard.querySelector('button').onclick = () => 
            setOrder(dishCard.getAttribute('data-dish'));
        
    });
}

document.addEventListener("DOMContentLoaded", dinamicCards);
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").onclick = function() {
        const chickenFig = document.getElementById('hiddenChicken');
        const snacksFig = document.getElementById('hiddenSnacks');
        const drinksFig = document.getElementById('hiddenDrinks');
        if (order.chicken) {
            chickenFig.value = order.chicken.keyword;
        };
        if (order.snacks) {
            snacksFig.value = order.snacks.keyword;
        };
        if (order.drinks) {
            drinksFig.value = order.drinks.keyword;
        };
    };

    document.getElementById("reset").onclick = function() {
        order.chicken = null;
        order.snacks = null;
        order.drinks = null;
        update();
    };
});
