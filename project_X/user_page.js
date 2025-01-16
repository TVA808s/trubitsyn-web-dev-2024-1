"use strict";

function close_modal() {
    document.querySelector(".modal_window").remove();
}

function look_function(created_at, name, phone, email,
    address, date, time, products, total, comment) {

    if (document.querySelector(".modal_window")) close_modal();
    const div = document.createElement("div");
    div.classList.add("modal_window");
    div.setAttribute("id", "look_modal");
    div.innerHTML = `
    <div class="modal_head">
        <b><p>Просмотр заказа</p></b>
        <button class="close_button" onclick="close_modal()"></button>
    </div>
    <div class="modal_body">
        <div class="modal_body_text_side">
            <p>Дата оформления</p>
            <p>Имя</p>
            <p>Номер телефона</p>
            <p>Email</p>
            <p>Адрес доставки</p>
            <p>Дата доставки</p>
            <p>Время доставки</p>
            <p>Состав заказа</p>
            <p>Стоимость</p>
            <p>Комментарий</p>
        </div>
        <div class="modal_body_text_side">
            <p>${created_at}</p>
            <p>${name}</p>
            <p>${phone}</p>
            <p>${email}</p>
            <p>${address}</p>
            <p>${date}</p>
            <p>${time}</p>
            <p class="overflow">${products}</p>
            <p>${total}</p>
            <p>${comment}</p>
        </div>
    
    </div>
    <div class="modal_footer">
        <button class="btn" onclick="close_modal()">Ок</button>
    </div>`;
    const main = document.querySelector("main");
    main.after(div);
}


function change_function(id, created_at, products, total,
    name, phone, email, address, date, time, comment) {

    if (document.querySelector(".modal_window")) close_modal();
    const div = document.createElement("div");
    div.classList.add("modal_window");
    div.setAttribute("id", "change_modal");
    div.innerHTML = `
    <div class="modal_head">
        <b><p>Просмотр заказа</p></b>
        <button class="close_button" onclick="close_modal()"></button>
    </div>
    <div class="modal_body">
        <div class="modal_body_text_side">
            <p>Дата оформления</p>
            <p>Имя</p>
            <p>Номер телефона</p>
            <p>Email</p>
            <p>Адрес доставки</p>
            <p>Дата доставки</p>
            <p>Время доставки</p>
            <p>Состав заказа</p>
            <p>Стоимость</p>
            <p>Комментарий</p>
        </div>
        <form>
            <div class="modal_body_text_side">
                <p>${created_at}</p>

                <input id="name" type="text" name="full_name" 
                    value="${name}" required>
                <input id="telephone" type="tel" name="phone" 
                    value="${phone}" required>
                <input id="email" type="email" name="email" 
                    value="${email}" required>
                <input id="address" type="text" name="address" 
                    value="${address}" required>
                <input id="date" type="date" name="date" 
                    value="${date}" required>

                <select id="time" required>
                    <option value="${time}">${time}</option>
                    <option value="08:00-12:00">08:00-12:00</option>
                    <option value="12:00-14:00">12:00-14:00</option>
                    <option value="14:00-18:00">14:00-18:00</option>
                    <option value="18:00-22:00">18:00-22:00</option>
                </select>
                <p class="overflow overflow_mobile width160">${products}</p>
                <p>${total}</p>
                <textarea id="comment">${comment}</textarea>
            </div>
    </form>
    </div>
    <div class="modal_footer">
        <button class="btn" onclick="close_modal()">Отмена</button>
        <button class="btn" onclick="change_order(${id})">Сохранить</button>
    </div>
    `;
    const main = document.querySelector("main");
    main.after(div);
}


function delete_function(id) {
    if (document.querySelector(".modal_window")) close_modal();
    const div = document.createElement("div");
    div.classList.add("modal_window");
    div.setAttribute("id", "delete_modal");
    div.innerHTML = `
    <div class="modal_head">
        <b><p>Удаление заказа</p></b>
        <button class="close_button" onclick="close_modal()"></button>
    </div>
    <div class="modal_body">
        <div class="modal_body_text_block">
            <p>Вы уверены, что хотите удалить заказ?</p>
        </div>
    </div>
    <div class="modal_footer">
        <button class="btn" onclick="close_modal()">Нет</button>
        <button class="btn" onclick="yes_delete(${id})">Да</button>
    </div>
    `;
    const main = document.querySelector("main");
    main.after(div);
}


async function displayOrders(orders) {
    const table_body = document.getElementById("table_body");
    table_body.innerHTML = ''; 
    let count = 0;
    
    // Обрабатываем заказы
    for (const order of orders) {
        const notification_block = document.getElementById("notifications");
        const notification = document.getElementById("notifications_status");
        let products_cost = 0;  
        let products_names = "";
        const productRequests = order.good_ids.map(async (id) => {
            const url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1" + 
            `/api/goods/${id}?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721`;
            try {
                const response = await fetch(url, { method: "GET" });
                if (!response.ok) {
                    let errorMessage = `Ошибка: ${response.status}`;
                    throw new Error(errorMessage);
                }
                const product = await response.json();

                products_names = products_names + product.name + ", ";
                if (product.discount_price != null) {
                    products_cost += product.discount_price; 
                } else {
                    products_cost += product.actual_price; 
                }
            } catch (error) {
                notification.textContent = 
                "Ошибка при запросе: " + error.message;
                notification_block.style.backgroundColor = "rgb(255, 151, 151)";
                notification_block.classList.remove("hidden");
                setTimeout(() => {
                    notification_block.classList.add("hidden");
                }, 5000);
            }
        });

        // завершение всех запросов
        await Promise.all(productRequests);
        // стоимость доставки
        let delivery_price;
        const date = new Date(order.delivery_date);
        if (date.getDay() in [0, 6]) {
            delivery_price = 500;
        } else if (order.delivery_interval === "18:00-22:00") {
            delivery_price = 400;
        } else {
            delivery_price = 200;
        }
        // создание и добавление записей
        const tr = document.createElement("tr");
        count++;
        const total_cost = products_cost + delivery_price;
        const created_at = order.created_at.split("T");
        const created_at_date = // другой формат отображения времени
        created_at[0].split("-").reverse().join("."); 
        const created_at_time = created_at[1].substring(0, 5); // без секунд
        const created_at_full = created_at_date + " " + created_at_time;
        const delivery_date = String(order.delivery_date).split(
            "-").reverse().join(".");
        const delivery_interval = order.delivery_interval;
        tr.innerHTML = `
            <th>${count}</th> 
            <th>${created_at_full}</th>
            <th class="overflow_mobile">${products_names}</th>
            <th>${total_cost}₽</th>  
            <th>${delivery_date}<br>${delivery_interval}</th>
            <th id="order_settings">
                <a class="settings_icon_block">
                    <img class="icon look_button table_icon" 
                    src="images/look_icon.png">
                </a>
                <a class="settings_icon_block">
                    <img class="icon change_button table_icon" 
                    src="images/change_icon.png">
                </a>
                <a class="settings_icon_block">
                    <img class="icon delete_button table_icon" 
                    src="images/delete_icon.webp">
                </a>
            </th>
        `;
        table_body.append(tr);

        const lookButton = tr.querySelector('.look_button');
        const changeButton = tr.querySelector('.change_button');
        const deleteButton = tr.querySelector('.delete_button');

        if (lookButton) {
            lookButton.addEventListener('click', () => look_function(
                created_at_full, order.full_name, order.phone, order.email,
                order.delivery_address, delivery_date, delivery_interval,
                products_names, total_cost, order.comment));
        }
        if (changeButton) {
            changeButton.addEventListener('click', () => change_function(
                order.id, created_at_full, products_names,
                total_cost, order.full_name, order.phone, order.email,
                order.delivery_address, order.delivery_date,
                delivery_interval, order.comment));
        }
        if (deleteButton) {
            deleteButton.addEventListener('click', () => 
                delete_function(order.id));
        }
    }

    // Если заказов меньше 10, добавляем строку с "..."
    if (orders.length < 10) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <th>${count + 1}</th>
            <th>...</th>
            <th>...</th>
            <th>...</th>
            <th>...</th>
            <th>...</th>`;
        table_body.append(tr);
    }
}

async function loadOrders() {
    const notification_block = document.getElementById("notifications");
    const notification = document.getElementById("notifications_status");
    const url = "https://edu.std-900.ist.mospolytech.ru" + 
    "/exam-2024-1/api/orders?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721";
    try {
        const response = await fetch(url, {method:"GET"});
        if (!response.ok) {
            let errorMessage = `Ошибка: ${response.status}`;
            throw new Error(errorMessage);
        };

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        notification.textContent = "Ошибка: " + error.message;
        notification_block.style.backgroundColor = "rgb(255, 151, 151)";
        notification_block.classList.remove("hidden");
        setTimeout(() => {
            notification_block.classList.add("hidden");
        }, 5000);
    }
}


async function change_order(id) {
    const url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1" + 
    `/api/orders/${id}?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721`;

    const notification_block = document.getElementById("notifications");
    const notification = document.getElementById("notifications_status");
    
    const data = { 
        full_name: document.getElementById("name").value,
        email: document.getElementById("email").value, 
        phone: document.getElementById("telephone").value,
        delivery_address: document.getElementById("address").value,
        delivery_date: document.getElementById("date").value.split(
            "-").reverse().join("."), 

        delivery_interval: document.getElementById("time").value, 
        comment: document.getElementById("comment").value,  
        updated_at: null
    };
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let errorMessage = `Ошибка HTTP: ${response.status}`;
            throw new Error(errorMessage);
        }

        const back = await response.json();

        if (back) {
            loadOrders();
            notification.textContent = "Заказ успешно изменен.";
            notification_block.style.backgroundColor = "rgb(185, 247, 185)";
            notification_block.classList.remove("hidden");
            document.getElementById("change_modal").remove();
            setTimeout(() => {
                notification_block.classList.add("hidden");
            }, 5000);
        } else {
            throw new Error('Получен пустой ответ от сервера');
        }
        
    } catch (error) {
        notification.textContent = "Ошибка при запросе: " + error.message;
        notification_block.style.backgroundColor = "rgb(255, 151, 151)";
        notification_block.classList.remove("hidden");
        setTimeout(() => {
            notification_block.classList.add("hidden");
        }, 5000);
    }
}

function yes_delete(id) {
    const url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1" + 
    `/api/orders/${id}?api_key=7172b88c-b8dc-4cc6-9e59-fab7e127c721`;

    const notification_block = document.getElementById("notifications");
    const notification = document.getElementById("notifications_status");
    fetch(url, {
        method: "DELETE",
    })
        .then(()=>{
            loadOrders();
            notification.textContent = "Заказ успешно удален.";
            notification_block.style.backgroundColor = "rgb(185, 247, 185)";
            notification_block.classList.remove("hidden");
            document.getElementById("delete_modal").remove();
            setTimeout(() => {
                notification_block.classList.add("hidden");
            }, 5000);
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
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", loadOrders);

document.addEventListener("DOMContentLoaded", function() {
    const notifications_close = document.getElementById(
        "notifications_close_button");
    notifications_close.addEventListener("click", function () {
        const notifications = document.getElementById("notifications");
        notifications.classList.add("hidden");
    });
});
