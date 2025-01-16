"use strict";

function displayProducts(products) { // вывод данных на страницу
    const cards_block = document.getElementById("cards_block");
    cards_block.innerHTML = ''; // очистка страницы 
    if (products.length > 0) { // есть данные 
        if (document.getElementById("NoProducts")) {
            document.getElementById("NoProducts").remove();
        }
        products.forEach(product => { // создание карточек
            const card = document.createElement('div');
            card.setAttribute("id", product.id);
            card.classList.add("card");
            if (product.discount_price != null) {
                const procent = Math.round(100 - product.discount_price
                    * 100 / product.actual_price);

                card.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}">
                    <div id="inline_block"><h3><p>${product.name}</p></h3></div>
                    <p id="rating">Рейтинг: ${product.rating} ⭐</p>
                    <div id="prices">
                        <p id="price">${product.discount_price}₽</p>
                        <p class="actual_price">${product.actual_price}₽</p>
                        <p class="procent">${procent}%</p>
                    </div>
                    <button>Добавить</button>`;
            } else {
                card.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}">
                    <h3><p>${product.name}</p></h3>
                    <p id="rating">Рейтинг: ${product.rating} ⭐</p>
                    <div id="prices">
                        <p id="price">${product.actual_price}₽</p>
                    </div>
                    <button>Добавить</button>`;
            }
            cards_block.append(card);
            card.querySelector('button').onclick = () => {
                window.localStorage.setItem(product.id, product.id);
            };
        });
        const sort_type = document.getElementById("sort");
        sort_type.dispatchEvent(new Event("change"));
    } else { // при поиске нет товаров
        if (document.getElementById("NoProducts")) {
            document.getElementById("NoProducts").remove();
        }
        const p = document.createElement("h3"); // надпись нет товаров
        p.innerHTML = "<p>Нет товаров, соответствующих вашему запросу</p>";
        p.setAttribute("id", "NoProducts");
        cards_block.after(p);
    }
}

async function loadProducts(url) { // сбор данных с сервера
    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        if (!response.ok) {
            console.log(1);
            let errorMessage = `Ошибка: ${response.status}`;
            throw new Error(errorMessage);
        };
        const products = await response.json();

        if (products) {
            displayProducts(products);
        } else {
            throw new Error('Получен пустой ответ от сервера');
        };   
    } catch (error) {
        const notification_block = document.getElementById("notifications");
        const notification = document.getElementById("notifications_status");
        notification.textContent = "Ошибка при запросе: " + error.message;
        notification_block.style.backgroundColor = "rgb(255, 151, 151)";
        notification_block.classList.remove("hidden");
        setTimeout(() => {
            notification_block.classList.add("hidden");
        }, 5000);
    }
}


document.addEventListener("DOMContentLoaded", loadProducts(
    "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api" + 
        "/goods?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721"));


document.addEventListener("DOMContentLoaded", function () {
    if (window.localStorage.getItem("order_done")) { // заказ выполнен
        const notification = document.getElementById("notifications_status");
        const notification_block = document.getElementById("notifications");
        notification.textContent = "Заказ успешно оформлен!";
        notification_block.style.backgroundColor = 
            "rgb(185, 247, 185)";
        notification_block.classList.remove("hidden");
        setTimeout(() => {
            notification_block.classList.add("hidden");
        }, 5000);

        window.localStorage.clear();
    };

    const sort_type = document.getElementById("sort");
    sort_type.onchange = function() {
        const sort_type_value = sort_type.value;
        const cards = Array.from(document.querySelectorAll(".card"));
        let sorted_cards = [];

        if (sort_type_value === "rate_down") { 
            sorted_cards = cards.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector(
                    "#rating").textContent.replace("Рейтинг: ", ""));
                const ratingB = parseFloat(b.querySelector(
                    "#rating").textContent.replace("Рейтинг: ", ""));
                return ratingB - ratingA;
            });
            
        } else if (sort_type_value === "cost_up") { 
            sorted_cards = cards.sort((a, b) => {
                const priceA = parseFloat(a.querySelector(
                    "#price").textContent);
                const priceB = parseFloat(b.querySelector(
                    "#price").textContent);
                return priceA - priceB;
            });
                
        } else if (sort_type_value === "rate_up") { 
            sorted_cards = cards.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector(
                    "#rating").textContent.replace("Рейтинг: ", ""));
                const ratingB = parseFloat(b.querySelector(
                    "#rating").textContent.replace("Рейтинг: ", ""));
                return ratingA - ratingB;
            });

        } else if (sort_type_value === "cost_down") { 
            sorted_cards = cards.sort((a, b) => {
                const priceA = parseFloat(a.querySelector(
                    "#price").textContent);
                const priceB = parseFloat(b.querySelector(
                    "#price").textContent);
                return priceB - priceA;
            });
        } 

        const cards_block = document.getElementById("cards_block");
        cards_block.innerHTML = ''; // очистка страницы
        sorted_cards.forEach(card => {
            cards_block.append(card); // добавление отсортированных карточек
        });
    };

    // поиск
    const search_form = document.getElementById("search_form");
    const search_bar = document.getElementById("search_bar");

    search_form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const search_bar_value = search_bar.value;
        const url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api" + 
        "/goods?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721" + 
        `&query=${encodeURIComponent(search_bar_value)}`;

        const search_offers = document.getElementById("search_offers");
        search_offers.classList.add("hidden");
        loadProducts(url);
    });

    // автодополнения поискового запроса
    search_bar.oninput = async function() {
        const search_bar_value = search_bar.value;
        const url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1" + 
        "/api/autocomplete?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721" + 
        `&query=${encodeURIComponent(search_bar_value)}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(response.message);
            }
            const offer = await response.json(); // все вариации имен
            if (offer) {
                const search_offers = document.getElementById("search_offers");
                search_offers.innerHTML = '';
                for (let i = 0; i < 5; i++) { // 5 автодополнений
                    const p = document.createElement("p");
                    p.textContent = offer[i];
                    p.onclick = function() {
                        search_bar.value = p.textContent;
                    };
                    if (p.textContent) {
                        search_offers.append(p);
                    }
                }
            }
        } catch (error) {
            const notification_block = document.getElementById("notifications");
            const notification = 
                document.getElementById("notifications_status");
            notification.textContent = "Ошибка при запросе " + error.message;
            notification_block.style.backgroundColor = "rgb(255, 151, 151)";
            notification_block.classList.remove("hidden");
            setTimeout(() => {
                notification_block.classList.add("hidden");
            }, 5000);
        }
    };

    search_bar.onfocus = function() {
        const search_offers = document.getElementById("search_offers");
        search_offers.classList.remove("hidden");
    };

    // скрывает дополнения и стирает записи при клике вне автодополнений
    document.addEventListener("click", (event)=>{   
        const search_offers = document.getElementById("search_offers");
        if (!search_bar.contains(event.target)) {
            search_offers.classList.add("hidden");
            search_offers.innerHTML = "";
        }
    });
    
    // закрытие уведомлений по нажатию
    const notifications_close_button = 
    document.getElementById("notifications_close_button");
    notifications_close_button.addEventListener("click", function () {
        const notifications = document.getElementById("notifications");
        notifications.classList.add("hidden");
    });

});
