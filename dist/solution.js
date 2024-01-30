"use strict"; 
// Код который сгенерировал TypeScript
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const data_json_1 = __importDefault(require("./data.json"));
// const data = await fetch('data.json').then((response) => response.json());
import data from '/data.json' assert {type: "json"};
const titles = ['Имя', 'Фамилия', 'Описания', 'Цвет глаз'];
const pages = parsedPages(data, 10);
let formIsActive = false;
renderTable();
function parsedPages(data, chunkSize) {
    let pages = new Array;
    for (let i = 0; i < data.length; i += chunkSize) {
        let page = data.slice(i, i + chunkSize); // Происходит срез массива
        let newPage = new Array;
        page.forEach(user => {
            newPage.push({
                nameF: user.name.firstName,
                nameL: user.name.lastName,
                about: user.about,
                color: user.eyeColor
            });
        });
        pages.push(newPage);
    }
    return pages;
}
function $(nameElem) {
    return document.createElement(nameElem);
}
function renderTable() {
    const table = $('table'); // Создание тега
    table.classList.add('table');
    table.appendChild(tableHeader()); // Добавление таблице thead
    table.appendChild(tableBody(0)); // Добавление первой страницы
    createButtonsForPages();
    document.body.appendChild(table); // Отрисовка
}
// Header
function tableHeader() {
    const thead = document.createElement('thead');
    const rowHead = thead.insertRow();
    // Создание заголовков
    titles.forEach((title) => {
        rowHead.insertCell().outerHTML = `<th>${title}</th>`;
    });
    // Добавление на каждый элемент слушателя
    for (const th of rowHead.cells) {
        th.addEventListener('mousedown', (e) => {
            if (e.button == 0) { // Если нажата ЛКМ сортировка
                sortTable(th.cellIndex);
            }
            else { // В других случаях спрятать
                const cells = document.querySelectorAll(`.col-${th.cellIndex}`);
                // Все ячейки данного столбца спрятать
                cells.forEach(cell => {
                    cell.classList.toggle('hidden');
                });
            }
        });
    }
    return thead;
}
function sortTable(colNum) {
    let tbody = document.querySelector('tbody');
    if (tbody == null)
        return;
    let row = tbody.rows[0];
    let rowsArray = Array.from(tbody.rows); // Создаём массив из строк таблицы
    if (row.cells[colNum].classList.contains('hidden'))
        return; // Проверка на скрытие
    rowsArray.sort((rowA, rowB) => {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
    });
    tbody.append(...rowsArray); // заменяем таблицу
}
// Body
// Функция создания строк в таблице
function tableBody(indexPage) {
    const tbody = document.createElement('tbody');
    pages[indexPage].forEach(({ nameF, nameL, about, color }) => {
        let rowBody = tbody.insertRow();
        // Добавление ячеек в строку
        addCellSimple(rowBody, nameF, 'col-0');
        addCellSimple(rowBody, nameL, 'col-1');
        addCellSimple(rowBody, about, 'col-2');
        addCellColor(rowBody, color);
        rowBody.onclick = (e) => {
            const target = e.target;
            if (e.target == null)
                return;
            if (target.localName != 'p')
                return; // Если пользователь нажал не на элемент строки
            let tr = target.parentNode; // Элемент tr в котором находится текст
            if (formIsActive)
                return; // Если уже в режиме редактирования
            if (tr.localName != 'tr')
                tr = tr.parentNode;
            ; // Для колонки с цветом т.к. p наход в div
            showForm(tr);
        };
    });
    return tbody;
}
function addCellSimple(row, value, className) {
    const p = $('p');
    p.textContent = value;
    const cell = row.insertCell();
    cell.classList.add(className);
    if (className == 'col-2') { // Нужно для столбца с текстом
        p.classList.add('about-text');
    }
    cell.appendChild(p);
    return cell;
}
function addCellColor(row, value) {
    const p = $('p');
    p.textContent = value;
    p.style.color = value;
    const div = $('div');
    div.style.backgroundColor = value;
    div.appendChild(p);
    const cell = row.insertCell();
    cell.classList.add('col-3');
    cell.appendChild(div);
    return cell;
}
// Создание формы для редактирования строки
function showForm(tr) {
    formIsActive = true;
    const form = $('div');
    form.classList.add('form');
    const tds = Array.from(tr.children); // Получаем ячейки строки
    tds.forEach((td) => {
        const text = document.createElement('textarea');
        if (td.classList.contains('col-2')) { // для ячейки с текстом
            text.style.height = 200 + 'px';
        }
        if (td instanceof HTMLElement) {
            text.value = td.innerText;
        }
        form.appendChild(text);
    });
    createForm(tds, form);
    document.body.appendChild(form);
}
function createForm(elms, form) {
    const texts = Array.from(form.childNodes);
    const btnAccept = createButton('Change');
    const btnCancel = createButton('Cancel');
    // Если нажата кнопка изменить
    btnAccept.onclick = () => {
        // Замена значений в ячейках
        for (let i = 0; i < texts.length; i++) {
            if (i == 3) { // для изменения цвета
                const div = elms[i].lastChild;
                if (div && div.style) {
                    div.style.backgroundColor = texts[i].value;
                    if (div.lastChild instanceof HTMLElement) {
                        div.lastChild.style.color = texts[i].value;
                        div.lastChild.textContent = texts[i].value;
                    }
                }
                continue;
            }
        }
        formIsActive = false;
        form.remove();
    };
    // Если нажата кнопка отменить
    btnCancel.onclick = () => {
        formIsActive = false;
        form.remove();
    };
    form.appendChild(btnAccept);
    form.appendChild(btnCancel);
    return form;
}
function createButton(innerText) {
    const btn = document.createElement('button');
    btn.innerText = innerText;
    return btn;
}
function createButtonsForPages() {
    const btnNext = createButton('->');
    const btnBack = createButton('<-');
    let count = 0;
    btnNext.onclick = () => {
        if (count + 1 > pages.length - 1)
            return; // проверка на выход из массива 
        turnPage(++count);
    };
    btnBack.onclick = () => {
        if (count - 1 < 0)
            return; // проверка на выход из массива 
        turnPage(--count);
    };
    document.body.appendChild(btnBack);
    document.body.appendChild(btnNext);
}
// Функция для перехода на страницу
function turnPage(index) {
    const tbody = document.querySelector('tbody');
    if (tbody) {
        tbody.remove();
        const table = document.querySelector('table');
        table && table.appendChild(tableBody(index));
    }
}
