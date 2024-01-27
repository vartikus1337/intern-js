const DATA = await fetch('data.json').then((response) => response.json());
const TITLES = ['Имя', 'Фамилия', 'Описания', 'Цвет глаз'];

const pages = parsedPages(DATA, 10);
let formIsActive = false;
renderTable()

// Функция для создания элемента html
function $(nameElem) {
    return document.createElement(nameElem);
}

// Функция для парсинга данных
function parsedPages(data, chunkSize) {
    const pages = Array();
    for (let i = 0; i < data.length; i += chunkSize) {
        let page = data.slice(i, i + chunkSize);
        page = page.map(({name, about, eyeColor}) => (
            {
                nameF: name.firstName,
                nameL: name.lastName,
                about: about,
                color: eyeColor
            }
        ));
        pages.push(page);
    }
    return pages;
}

// Функция для отображения таблицы
function renderTable(pages) {
    const table = $('table');
    table.classList.add('table');
    table.appendChild(tableHeader());
    table.appendChild(tableBody(0));
    createButtonsForPages()
    document.body.appendChild(table);
}


// Функция для создания колонок
function tableHeader() {
    const thead = $('thead');
    let rowHead = thead.insertRow();

    TITLES.forEach((title) => {
        rowHead.insertCell().outerHTML = `<th>${title}</th>`;
    });

    for (const th of rowHead.cells) {
        th.addEventListener('mousedown', (e) => {
            if (e.button == 0) {
                sortTable(e.target.cellIndex);
            } else {
                const cells = document.querySelectorAll(`.col-${th.cellIndex}`)
                console.log(cells)
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
    let rowsArray = Array.from(tbody.children);
    rowsArray.sort((rowA, rowB) => {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
    });
    tbody.append(...rowsArray);
}

// Функция создания строк в таблице
function tableBody(indexPage) {
    const tbody = $('tbody');
    pages[indexPage].forEach(({nameF, nameL, about, color}) => {
        let rowBody = tbody.insertRow();
        addCellSimple(rowBody, nameF, 'col-0');
        addCellSimple(rowBody, nameL, 'col-1');
        addCellSimple(rowBody, about, 'col-2');
        addCellColor(rowBody, color);
        rowBody.onclick = (e) => {
            if (e.target.localName != 'p') return;
            const tr = e.target.parentNode.parentNode;
            if (!formIsActive) {
                showForm(tr);
            } 
        };
    });
    return tbody;
}

function addCellSimple(row, value, className) {
    const p = $('p');
    p.textContent = value;
    const cell = row.insertCell();
    cell.classList.add(className);
    if (className == 'col-2') {
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

function showForm(tr) {
    formIsActive = true;
    const div = $('div');
    div.classList.add('form');
    const elms = Array.from(tr.childNodes);
    elms.forEach((el) => {
        const text = $('textarea');
        if (el.classList.contains('col-2')) {
            text.style.height = 200 + 'px';
        }
        text.value = el.innerText;
        div.appendChild(text);
    })
    logicButtons(elms, div);
    document.body.appendChild(div);
}

function logicButtons(elms, div) {
    const texts = Array.from(div.childNodes);
    const btnAccept = $('button')
    const btnCancel = $('button')
    btnAccept.innerText = "Change";
    btnCancel.innerText = "Cancel";
    btnAccept.onclick = () => {
        for (let i = 0; i < texts.length; i++) {
            if (i == 3) {
                const div = elms[i].lastChild;
                div.style.backgroundColor = texts[i].value;
                div.lastChild.style.color = texts[i].value;
                div.lastChild.textContent = texts[i].value;
                continue;
            } 
            if (i == 2) {
                elms[i].children.textContent = texts[i].value;
                continue;
            }
            elms[i].textContent = texts[i].value;
        }
        formIsActive = false;
        div.remove(); 
        
    }
    btnCancel.onclick = () => {
        formIsActive = false;
        div.remove();
    }
    div.appendChild(btnAccept);
    div.appendChild(btnCancel);
    return div;
}

function createButtonsForPages() {
    const btnNext = $('button');
    const btnBack = $('button');
    btnNext.innerText = "->";
    btnBack.innerText = "<-";
    let count = 0
    btnNext.onclick = () => {
        let tbody = document.querySelector('tbody');
        if (count + 1 > 4) return;
        tbody.remove()
        document.querySelector('table').appendChild(tableBody(++count))
    }
    btnBack.onclick = () => {
        let tbody = document.querySelector('tbody');
        if (count - 1 < 0) return;
        tbody.remove()
        document.querySelector('table').appendChild(tableBody(--count))
    }
    document.body.appendChild(btnBack);
    document.body.appendChild(btnNext);
}