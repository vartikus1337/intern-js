const DATA = await fetch('data.json').then((response) => response.json());

let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');

table.style.width = "50%";

document.body.appendChild(table);

table.appendChild(thead)

let rowHead = thead.insertRow();
rowHead.insertCell().outerHTML = "<th>Имя</th>";
rowHead.insertCell().outerHTML = "<th>Фамилия</th>";
rowHead.insertCell().outerHTML = "<th>Описания</th>";
rowHead.insertCell().outerHTML = "<th>Цвет глаз</th>";

for (const td of rowHead.cells) {
    td.classList.add("table-title");
    td.addEventListener('click', (e) => {
        let th = e.target;
        sortTable(th.cellIndex);
    });
}

(function default_fn() {
    table.appendChild(tbody)
    DATA.forEach((el) => {
        const row = tbody.insertRow();
        row.insertCell().innerHTML = el["name"]["firstName"];
        row.insertCell().innerHTML = el["name"]["lastName"];
        let p = document.createElement('p');
        p.classList.add('about-text');
        p.textContent = el["about"];
        row.insertCell().appendChild(p)
        row.insertCell().innerHTML = el["eyeColor"];
    });
})()

table.onclick = function(e) {
    if (e.target.tagname != 'th') return console.log(e.target.tagname);
    let th = e.target;
    sortTable(th.cellIndex);
}

function sortTable(colNum) {
    let tbody = table.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);
    let compare = function(rowA, rowB) {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
    };
    rowsArray.sort(compare);
    tbody.append(...rowsArray);
}