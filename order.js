"use strict";
"massive.js";

let order = {
    chicken : null,
    burgers : null,
    snacks : null,
    drinks : null,
    deserts : null
};

function total() {
    const price = document.getElementById("total");
    let total = 0;
    if (order.chicken) {
        total += order.chicken.price;
    };
    if (order.burgers) {
        total += order.burgers.price;
    };
    if (order.snacks) {
        total += order.snacks.price;
    };
    if (order.drinks) {
        total += order.drinks.price;
    };
    if (order.deserts) {
        total += order.deserts.price;
    };
    price.textContent = `${total}₽`;
}

function update() {
    const none = document.getElementById("nothing");
    const selectedDishes = document.getElementById("selectedDishes");
    
    if (order.chicken || order.burgers || order.snacks || 
        order.drinks || order.deserts) {
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

    if (selectedDish.category === "burgers") {
        order.burgers = selectedDish;
        document.getElementById("noBurgers").textContent = 
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

    if (selectedDish.category === "deserts") {
        order.deserts = selectedDish;
        document.getElementById("noDeserts").textContent =
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
        dishCard.classList.add(dish.kind);
        dishCard.innerHTML = 
            `<img src='${dish.image}' alt='${dish.name}'>
            <p class='cost'>${dish.price} ₽</p>
            <p class='name'>${dish.name}</p>
            <p class='gramms'>${dish.count}</p>
            <button>Добавить</button>`;

        if (dish.category === 'chicken') {
            dishSections[0].append(dishCard);
        } else if (dish.category === 'burgers') {
            dishSections[1].append(dishCard);
        } else if (dish.category === 'snacks') {
            dishSections[2].append(dishCard);
        } else if (dish.category === 'drinks') {
            dishSections[3].append(dishCard);
        } else if (dish.category === 'deserts') {
            dishSections[4].append(dishCard);
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
        const desertsFig = document.getElementById('hiddenDeserts');
        const burgersFig = document.getElementById('hiddenBurgers');
        if (order.chicken) {
            chickenFig.value = order.chicken.keyword;
        };
        if (order.burgers) {
            burgersFig.value = order.burgers.keyword;
        };
        if (order.snacks) {
            snacksFig.value = order.snacks.keyword;
        };
        if (order.drinks) {
            drinksFig.value = order.drinks.keyword;
        };
        if (order.deserts) {
            desertsFig.value = order.deserts.keyword;
        };
    };

    document.getElementById("reset").onclick = function() {
        order.chicken = null;
        order.burgers = null;
        order.snacks = null;
        order.drinks = null;
        order.deserts = null;
        update();
    };

    
    const buttons = document.querySelectorAll('[data-kind]');
    buttons.forEach((b) => {
        b.onclick = function() {
            //для показа блюд
            let kind = b.getAttribute("data-kind");
            let parent = b.parentElement.parentElement;
            let cards = parent.querySelectorAll("[data-dish]");

            //установление класса active кнопке
            if (b.classList.contains("active")) {
                b.classList.remove("active");
                //при повторном нажатии на кнопку показывает все блюда
                cards.forEach((card) => {
                    card.classList.remove("hidden");
                });
            } else {
                let div = b.closest("div");
                let pos = div.getAttribute("id");
                buttons.forEach((a) => {
                    if (a.closest("div").getAttribute("id") === pos) {
                        a.classList.remove("active");
                    };
                });
                b.classList.add("active");

                //при первичном нажатии на кнопку убирает не нужные блюда
                cards.forEach((card) => {
                    if (card.classList.contains(kind)) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    };
                });
            };
        };
    });

    const form = document.querySelector(".form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let message = "";
        if (document.getElementById("nothing").style.display === "block") {
            message = "<p>Nothing is on the list</p>";
        } else if (((order.bugers != null && order.chicken != null && 
        order.snacks != null) || (order.burgers != null && 
        order.chicken != null) || (order.burgers != null &&
        order.snacks != null) || (order.chicken != null &&
        order.snacks != null) || order.chicken != null) && 
        order.drinks == null) { 
            message = "<p>Chose a drink</p>";
        } else if (order.burgers != null && order.chicken == null && 
        order.snacks == null) {
            message = "<p>Chose some tenders or a snack</p>";
        } else if (order.snacks != null && order.burgers == null && 
        order.chicken == null) {
            message = "<p>Chose some tenders or a burger</p>";
        } else if ((order.drinks != null || order.deserts != null) 
        && order.chicken == null) {
            message = "<p>Chose some tenders</p>";
        } else {
            form.submit();
            return;
        };
        
        const div = document.createElement("div");
        div.className = "alert";
        div.innerHTML = message;

        const button = document.createElement("button");
        button.className = "okey";
        button.textContent = "Okey👌";
        button.addEventListener('click', () => div.remove());

        div.appendChild(button);
        document.body.appendChild(div);
    });
});
