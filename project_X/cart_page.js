"use strict";

function total_price() { // установка финальной цены
    const total_cost = document.getElementById("total_cost");
    // (беру только числа и на всякий случай преобразую в число)
    const delivery = Number(document.getElementById("dilivery_cost")
        .textContent.match(/\d+/)[0]);
    const good = Number(document.getElementById("products_cost").textContent);
    total_cost.textContent = `Итоговая цена: ${good + delivery}₽`;
}

// данные с сервера и создания карточек + определения общей цены товаров
async function loadCart() { 
    const notification_block = document.getElementById("notifications");
    const notification = document.getElementById("notifications_status");
    const cards_block = document.getElementById("cards_block");
    cards_block.innerHTML = ''; // обновление записей
    const cart_empty = document.getElementById("cart_empty"); 
    cart_empty.classList.remove("hidden"); // не пустая карзина
    const promises = []; // массив для хранения промисов
    let products_cost = 0; // использую как цену товара
    // получение записей и создание карточек
    for (let i = 0; i < localStorage.length; i++) { 
        cart_empty.classList.add("hidden");
        const key = localStorage.key(i);
        const urlkey = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1" + 
        `/api/goods/${key}?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721`;
        const promise = fetch(urlkey, {method: 'GET'}) // обращаюсь к серверу
            .then(response => {
                if (!response.ok) {
                    let errorMessage = `Ошибка: ${response.status}`;
                    throw new Error(errorMessage);
                }
                return response.json();
            })

            .then(product => { // получаю объект продукт
                const card = document.createElement('div');
                card.setAttribute("id", product.id);
                card.classList.add("card");
                if (product.discount_price != null) {
                    const procent = Math.round(100 -
                        product.discount_price * 100 / product.actual_price);

                    card.innerHTML = `
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3><p>${product.name}</p></h3>
                        <p id="rating">Рейтинг: ${product.rating} ⭐</p>
                        <div id="prices">
                            <p id="price">${product.discount_price}₽</p>
                            <p class="actual_price">${product.actual_price}₽</p>
                            <p class="procent">${procent}%</p>
                        </div>
                        <button>Удалить</button>`;
                } else {
                    card.innerHTML = `
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3><p>${product.name}</p></h3>
                        <p id="rating">Рейтинг: ${product.rating} ⭐</p>
                        <div id="prices">
                            <p id="price">${product.actual_price}₽</p>
                        </div>
                        <button>Удалить</button>`;
                }
            
                cards_block.append(card); //вывод карточки

                card.querySelector('button').onclick = () => {
                    if (product.discount_price > 0) { // изменение цены
                        document.getElementById("products_cost").textContent -= 
                        product.discount_price;
                    } else {
                        document.getElementById("products_cost").textContent -= 
                        product.actual_price;
                    }
                    total_price();

                    window.localStorage.removeItem(key); // очистка
                    card.remove();

                    const cards_block = document.getElementById("cards_block");
                    if (cards_block.textContent === "") {
                        cart_empty.classList.remove("hidden");
                    };
                };
            
                if (product.discount_price > 0) {
                    products_cost += product.discount_price;
                } else {
                    products_cost += product.actual_price;
                };
            })
            .catch(error =>{
                notification.textContent = 
                "Ошибка при запросе: " + error.message;
                notification_block.style.backgroundColor = "rgb(255, 151, 151)";
                notification_block.classList.remove("hidden");
                setTimeout(() => {
                    notification_block.classList.add("hidden");
                }, 5000);
            });
            
        promises.push(promise); // добавляет промис в массив
    }
    await Promise.all(promises); // завершение всех запросов

    const p = document.createElement("div"); // спрятаная цена всех товаров
    p.innerHTML = `<p id="products_cost" class="hidden">${products_cost}</p>`;
    document.getElementById("total").append(p);
    total_price(); // вызов установки финальной цены
}

function day() { // проверка дня недели
    const dilivery_price_html = document.getElementById("dilivery_cost");
    let dilivery_price = 200;
    let date = new Date(document.getElementById('date').value);
    if (date.getDay() in [0, 6]) { // проверка на выходные
        dilivery_price += 300;
    }
    dilivery_price_html.textContent = 
    `(стоимость доставки: ${dilivery_price}₽)`;
    total_price(); // для изменения финальной цены
}

function period() { // проверка времени
    const dilivery_price_html = document.getElementById("dilivery_cost");
    //проверка на выходной
    if (dilivery_price_html.innerHTML != "(стоимость доставки: 500₽)") {
        let dilivery_price = 200;
        const time = document.getElementById("time").value;
        if (time === "18:00-22:00") { // проверка на вечер будней
            dilivery_price += 200;
        }
        dilivery_price_html.textContent = 
        `(стоимость доставки: ${dilivery_price}₽)`; 
        total_price(); // для изменения финальной цены 
    }
    dilivery_price_html.textContent = 
    `(стоимость доставки: ${dilivery_price}₽)`;
    total_price(); // для изменения финальной цены
}

function products_from_localStorage() {
    const products_ids = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        products_ids.push(key);
    };
    return products_ids; // возвращаем массив с id
}

document.addEventListener("DOMContentLoaded", loadCart);

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    form.addEventListener("submit", async (event) => {
        const notification_block = document.getElementById("notifications");
        const notification = document.getElementById("notifications_status");
        const empty_cart = document.getElementById("cards_block").innerHTML;
        if (empty_cart === "") {
            event.preventDefault();
            notification.textContent = "Добавьте товар перед заказом";
            notification_block.style.backgroundColor = "rgb(139, 203, 255)";
            notification_block.classList.remove("hidden");
            setTimeout(() => {
                notification_block.classList.add("hidden");
            }, 5000);
        } else {
            event.preventDefault();
            const comment = document.getElementById("comment").value;
            const address = document.getElementById("address").value;
            const date = 
            document.getElementById(
                "date").value.split("-").reverse().join(".");

            const time = document.getElementById("time").value;
            const email = document.getElementById("email").value;
            const name = document.getElementById("name").value;
            const phone = document.getElementById("telephone").value;
            const subscribe = document.getElementById(
                "subscribe").checked ? 1 : 0;

            const data = {
                id: null, 
                full_name: name,
                email: email,
                subscribe: subscribe, 
                phone: phone,
                delivery_address: address,
                delivery_date: date, 
                delivery_interval: time, 
                comment: comment,
                good_ids: products_from_localStorage(), 
                created_at: null, 
                updated_at: null,
                student_id: null
            };
            
            const url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/" +
            "api/orders?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721";

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
        
                if (!response.ok) {
                    let errorMessage = `Ошибка: ${response.status}`;
                    throw new Error(errorMessage);
                }
        
                const back = await response.json();
            
                if (back) {
                    window.localStorage.clear();
                    window.localStorage.setItem("order_done", "order_done");
                    window.location.href = "main_page.html";
                } else {
                    throw new Error('Получен пустой ответ от сервера');
                }
                window.scrollTo(0, 0);
            } catch (error) {
                notification.textContent = 
                "Ошибка при запросе: " + error.message;
                notification_block.style.backgroundColor = "rgb(255, 151, 151)";
                notification_block.classList.remove("hidden");
                setTimeout(() => {
                    notification_block.classList.add("hidden");
                }, 5000);
            }
        }
    });
    // закрытие уведомлений по нажатию
    const notifications_close = 
    document.getElementById("notifications_close_button");
    notifications_close.addEventListener("click", function () {
        const notifications = document.getElementById("notifications");
        notifications.classList.add("hidden");
    });
});

