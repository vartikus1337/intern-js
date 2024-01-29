const DATA = await fetch('data.json').then((response) => response.json());
const TITLES = ['Имя', 'Фамилия', 'Описания', 'Цвет глаз'];

const pages = parsedPages(DATA, 10);
let formIsActive = false;
renderTable();

// Функция для создания элемента html
function $(nameElem) {
    return document.createElement(nameElem);
}

// Функция для парсинга данных
function parsedPages(data, chunkSize) {
    const pages = Array();
    for (let i = 0; i < data.length; i += chunkSize) {
        let page = data.slice(i, i + chunkSize); // Происходит срез массива
        page = page.map(({name, about, eyeColor}) => ( // Подмена данных
            {
                nameF: name.firstName,
                nameL: name.lastName,
                about: about,
                color: eyeColor
            }
        ));
        pages.push(page); // Добавление в новый массив
    }
    return pages;
}

// Функция для отображения таблицы
function renderTable() {
    const table = $('table'); // Создание тега
    table.classList.add('table');
    table.appendChild(tableHeader()); // Добавление таблице thead
    table.appendChild(tableBody(0)); // Добавление первой страницы
    createButtonsForPages()
    document.body.appendChild(table); // Отрисовка
}

// Функция для создания заголовков таблицы и сортировка  
function tableHeader() {
    const thead = $('thead');
    let rowHead = thead.insertRow();
    // Создание заголовков
    TITLES.forEach((title) => {
        rowHead.insertCell().outerHTML = `<th>${title}</th>`;
    });
    // Добавление на каждый элемент слушателя
    for (const th of rowHead.cells) {
        th.addEventListener('mousedown', (e) => {
            if (e.button == 0) { // Если нажата ЛКМ сортировка
                sortTable(e.target.cellIndex);
            } else { // В других случаях спрятать
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

// Функция сортировки
function sortTable(colNum) {
    let tbody = document.querySelector('tbody');
    let rowsArray = Array.from(tbody.children); // Создаём массив из строк таблицы
    if (rowsArray[0].cells[colNum].classList.contains('hidden')) return; // Проверка на скрытие
    rowsArray.sort((rowA, rowB) => { // сравнивание строк у каждого элемента
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
    });
    tbody.append(...rowsArray); // заменяем таблицу
}

// Функция создания строк в таблице
function tableBody(indexPage) {
    const tbody = $('tbody');
    pages[indexPage].forEach(({nameF, nameL, about, color}) => {
        let rowBody = tbody.insertRow();
        // Добавление ячеек в строку
        addCellSimple(rowBody, nameF, 'col-0'); 
        addCellSimple(rowBody, nameL, 'col-1');
        addCellSimple(rowBody, about, 'col-2');
        addCellColor(rowBody, color);
        rowBody.onclick = (e) => {
            if (e.target.localName != 'p') return; // Если пользователь нажал не на элемент строки
            let tr = e.target.parentNode.parentNode; // Элемент tr в котором находится текст
            if (formIsActive) return; // Если уже в режиме редактирования
            if (tr.localName != 'tr') tr = tr.parentNode; // Для колонки с цветом т.к. p наход в div
            showForm(tr);
        };
    });
    return tbody;
}

// Добавление обычной ячейки
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

// Добавление ячейки с цветом
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
    const tds = Array.from(tr.childNodes); // Получаем ячейки строки
    tds.forEach((td) => {
        const text = $('textarea');
        if (td.classList.contains('col-2')) { // для ячейки с текстом
            text.style.height = 200 + 'px';
        }
        text.value = td.innerText;
        form.appendChild(text);
    });
    createForm(tds, form);
    document.body.appendChild(form);
}

// Функция для создания формы
function createForm(elms, form) {
    const texts = Array.from(form.childNodes);
    const btnAccept = createButton('Change');
    const btnCancel = createButton('Cancel');
    // Если нажата кнопка изменить
    btnAccept.onclick = () => {
        // Замена значений в ячейках
        for (let i = 0; i < texts.length; i++) {
            if (i == 3) { // для изменения цвета
                const form = elms[i].lastChild;
                form.style.backgroundColor = texts[i].value;
                form.lastChild.style.color = texts[i].value;
                form.lastChild.textContent = texts[i].value;
                continue;
            } 
            if (i == 2) { // для текста about
                elms[i].lastChild.textContent = texts[i].value;
                continue;
            }
            
            elms[i].textContent = texts[i].value; // для всего остального
        }
        formIsActive = false;
        form.remove(); 
    }
    // Если нажата кнопка отменить
    btnCancel.onclick = () => {
        formIsActive = false;
        form.remove();
    }
    form.appendChild(btnAccept);
    form.appendChild(btnCancel);
    return form;
}

// Создание кнопок для перемещения между страниц
function createButtonsForPages() {
    const btnNext = createButton('->');
    const btnBack = createButton('<-');
    let count = 0;
    btnNext.onclick = () => {
        if (count + 1 > pages.length - 1) return; // проверка на выход из массива 
        turnPage(++count);
    }
    btnBack.onclick = () => {
        if (count - 1 < 0) return; // проверка на выход из массива 
        turnPage(--count);
    }
    document.body.appendChild(btnBack);
    document.body.appendChild(btnNext);
}

// Функция для создания кнопок
function createButton(innerText) {
    const btn = $('button');
    btn.innerText = innerText;
    return btn;
}

// Функция для перехода на страницу
function turnPage(index) {
    let tbody = document.querySelector('tbody');
    tbody.remove();
    document.querySelector('table').appendChild(tableBody(index));
}