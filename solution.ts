import data from './data.json';
const titles: Array<string> = ['Имя', 'Фамилия', 'Описания', 'Цвет глаз'];

const pages = parsedPages(data, 10);
let formIsActive = false;
renderTable()

interface UserFromJSON {
  id: string
  name: Name
  phone: string
  about: string
  eyeColor: string
}

interface Name {
  firstName: string
  lastName: string
}

interface User {
  nameF: string
  nameL: string
  about: string
  color: string
}

function parsedPages(data: Array<UserFromJSON>, chunkSize: number): Array<Array<User>>  {
  let pages = new Array<Array<User>>;
  for (let i = 0; i < data.length; i += chunkSize) {
    let page: Array<UserFromJSON> = data.slice(i, i + chunkSize); // Происходит срез массива
    let newPage = new Array<User>;
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

function $(nameElem: string): HTMLElement {
  return document.createElement(nameElem);
}

function renderTable() {
  const table = $('table'); // Создание тега
  table.classList.add('table');
  table.appendChild(tableHeader()); // Добавление таблице thead
  table.appendChild(tableBody(0)); // Добавление первой страницы
  createButtonsForPages()
  document.body.appendChild(table); // Отрисовка
}

// Header

function tableHeader(): HTMLTableSectionElement {
  const thead = document.createElement('thead');
  const rowHead = thead.insertRow();
  // Создание заголовков
  titles.forEach((title) => {
      rowHead.insertCell().outerHTML = `<th>${title}</th>`;
  });
  // Добавление на каждый элемент слушателя
  for (const th of rowHead.cells) {
      th.addEventListener('mousedown',  (e: MouseEvent) => {
          if (e.button == 0) { // Если нажата ЛКМ сортировка
            sortTable(th.cellIndex);
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

function sortTable(colNum: number, ) {
  let tbody = document.querySelector('tbody');
  if (tbody == null) return;
  let row = tbody.rows[0]; 
  let rowsArray = Array.from(tbody.rows); // Создаём массив из строк таблицы
  if (row.cells[colNum].classList.contains('hidden')) return; // Проверка на скрытие
  rowsArray.sort((rowA, rowB) => { // сравнивание строк у каждого элемента
      return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
  });
  tbody.append(...rowsArray); // заменяем таблицу
}

// Body

// Функция создания строк в таблице
function tableBody(indexPage: number) {
  const tbody = document.createElement('tbody');
  pages[indexPage].forEach(({nameF, nameL, about, color}) => {
    let rowBody = tbody.insertRow();
    // Добавление ячеек в строку
    addCellSimple(rowBody, nameF, 'col-0'); 
    addCellSimple(rowBody, nameL, 'col-1');
    addCellSimple(rowBody, about, 'col-2');
    addCellColor(rowBody, color);
    rowBody.onclick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (e.target == null) return; 
      if (target.localName != 'p') return;  // Если пользователь нажал не на элемент строки
      let tr = target.parentNode?.parentNode as HTMLElement; // Элемент tr в котором находится текст
      if (formIsActive) return; // Если уже в режиме редактирования
      if (tr.localName != 'tr') tr = tr.parentNode as HTMLElement; // Для колонки с цветом т.к. p наход в div
      showForm(tr as HTMLTableRowElement);
    };
  });
  return tbody;
}

function addCellSimple(row: HTMLTableRowElement, value: string, className: string) {
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

function addCellColor(row:HTMLTableRowElement, value:string) {
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
function showForm(tr: HTMLTableRowElement) {
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

function createForm(elms: Element[], form: HTMLElement) {
  const texts = Array.from(form.childNodes) as Array<HTMLTextAreaElement>;
  const btnAccept = createButton('Change');
  const btnCancel = createButton('Cancel');
  // Если нажата кнопка изменить
  btnAccept.onclick = () => {
      // Замена значений в ячейках
      for (let i = 0; i < texts.length; i++) {
        if (i == 3) { // для изменения цвета
          const div = elms[i].lastChild as HTMLElement;
          if (div && div.style) {
            div.style.backgroundColor = texts[i].value;
            if (div.lastChild instanceof HTMLElement) {
              div.lastChild.style.color = texts[i].value;
              div.lastChild.textContent = texts[i].value;
            }
          }
          continue;
        }
        const lastChild = elms[i].lastChild;
        if (lastChild instanceof Node) {
              lastChild.textContent = texts[i].value; // для всего остального
        }
         
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

function createButton(innerText: string) {
    const btn = document.createElement('button');
    btn.innerText = innerText;
    return btn;
}

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

// Функция для перехода на страницу
function turnPage(index: number) {
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.remove();
      const table = document.querySelector('table');
      table && table.appendChild(tableBody(index));
    }
}