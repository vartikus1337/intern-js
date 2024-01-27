const DATA = await fetch('data.json').then((response) => response.json());
const TITLES = ['Имя', 'Фамилия', 'Описания', 'Цвет глаз'];

const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');
const div = document.createElement('div');
const textArea = document.createElement('textarea');
const btnAccept = document.createElement('button');
const btnCancel = document.createElement('button');

btnAccept.innerText = "Change";
btnCancel.innerText = "Cancel";
table.style.width = "50%";

document.body.appendChild(table);
table.appendChild(thead)

let rowHead = thead.insertRow();

TITLES.forEach((title) => {
    rowHead.insertCell().outerHTML = `<th>${title}</th>`;
});

for (const th of rowHead.cells) {
    th.classList.add("table-title");
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

(function default_fn() {
    table.appendChild(tbody)
    DATA.forEach((el) => {
        const row = tbody.insertRow();
        // Col-1
        let cell = row.insertCell()
        cell.classList.add("col-0")
        cell.innerHTML = el["name"]["firstName"];
        // Col-2
        cell = row.insertCell()
        cell.classList.add("col-1")
        cell.innerHTML = el["name"]["lastName"];
        // Col-3
        const p = document.createElement('p');
        p.classList.add('about-text');
        p.textContent = el["about"];
        cell = row.insertCell()
        cell.classList.add("col-2")
        cell.appendChild(p)
        // Col-4
        const divColor = document.createElement('div');
        divColor.classList.add('div-color');
        divColor.style.backgroundColor = el["eyeColor"];
        const pEye = document.createElement('p');
        pEye.textContent = el["eyeColor"]
        divColor.appendChild(pEye)
        cell = row.insertCell()
        cell.classList.add("col-3")
        cell.appendChild(divColor);
    });
    document.body.appendChild(div);
})()

table.onclick = function(e) {
    div.appendChild(textArea);
    textArea.style.width = 300 + 'px';
    textArea.style.height = 200 + 'px';
    let td = e.target
    textArea.value = td.innerText;
    div.appendChild(btnAccept);
    div.appendChild(btnCancel);
    
    btnAccept.onclick = () => {
         td.innerText = textArea.value;
    }

    btnCancel.onclick = () => {
        div.innerHTML = '';
    }
}

function sortTable(colNum) {
    let tbody = table.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);
    rowsArray.sort((rowA, rowB) => {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
    });
    tbody.append(...rowsArray);
}