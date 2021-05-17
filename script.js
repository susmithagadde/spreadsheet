let SIZE =  parseInt(localStorage["SIZE"]) || 6;
let COLUMN_LEN = parseInt(localStorage["COLUMN_LEN"]) || 6;
let COL_SELECTED = '';
let i;


(function() {
  getTableContent();
})()

function  getTableContent() {
    for (i=0; i<SIZE; i++) {
        var row = document.querySelector("table").insertRow(-1);
        row.id = "row" + i;
        for (var j=0; j<COLUMN_LEN; j++) {
            var letter = String.fromCharCode("A".charCodeAt(0)+j-1);
            row.insertCell(-1).innerHTML = i&&j ? "<input id='"+ letter+i +"'/>" : (i||letter) == '@' ? "" : `
            <div class="dropdown">
            <div class="dropbtn">${i || letter}</div>
            <div class="column-content" id="colDropdown">
                <span onclick="addColumn()">Add Column</span>
                <span onclick="sortTable()">Sort</span>
            </div>
            </div>`;
        }
    }
    insertCells();
}

function  insertCells() {
    var DATA={}, INPUTS=[].slice.call(document.querySelectorAll("input"));
    INPUTS.forEach(function(elm) {
        elm.onfocus = function(e) {
            e.target.value = localStorage[e.target.id] || "";
        };
        elm.onblur = function(e) {
            localStorage[e.target.id] = e.target.value;
            computeAll(INPUTS);
        };
        var getter = function() {
            var value = localStorage[elm.id] || "";
            if (value.charAt(0) == "=") {
                with (DATA) return eval(value.substring(1));
            } else { return isNaN(parseFloat(value)) ? value : parseFloat(value); }
        };
        Object.defineProperty(DATA, elm.id, {get:getter});
        Object.defineProperty(DATA, elm.id.toLowerCase(), {get:getter});
    });
    
    (window.computeAll = function() { 
        INPUTS.forEach(function(elm) {  
            try { elm.value = DATA[elm.id]; } catch(e) {} });
    })();
    
}

function addRow() {
    let rowSize = parseInt(localStorage["SIZE"]) || 6;
    localStorage["SIZE"] = rowSize + 1;
    var newRow = document.querySelector("table").insertRow(-1);
    for (var j=0; j<parseInt(localStorage["COLUMN_LEN"]); j++) {
        var letter = String.fromCharCode("A".charCodeAt(0)+j-1);
        let val = parseInt(localStorage["SIZE"]) - 1;
        newRow.insertCell(-1).innerHTML = i&&j ? "<input id='"+ letter+val +"'/>" : (val||letter) == '@' ? "" : (val || letter);
    }
    insertCells();
    showAddRowMenu();
}

function showAddRowMenu() {
    [...document.querySelectorAll('tbody tr')].forEach((row, i) => {
        let selectedRow = row.firstChild;
        if (selectedRow.addEventListener) {
          selectedRow.addEventListener('contextmenu', function(e) {
            document.getElementById("myDropdown").classList.toggle("show");
            e.preventDefault();
          }, false);
        } else {
          selectedRow.attachEvent('oncontextmenu', function() {
              document.getElementById("myDropdown").classList.toggle("show");
            window.event.returnValue = false;
          });
        }

        window.onclick = function(event) {
            if (!event.target.matches('.dropbtn')) {
              var dropdowns = document.getElementsByClassName("column-content");
              var rowDropdowns = document.getElementsByClassName("dropdown-content");
        
              var openDropdown = dropdowns[0];
              var openColDropdown = rowDropdowns[0];
                if (openDropdown.classList.contains('show')) {
                  openDropdown.classList.remove('show');
                }
                if (openColDropdown.classList.contains('show')) {
                  openColDropdown.classList.remove('show');
                }
            }
        }
    });
}

function showColumnMenu() {
    [...document.querySelectorAll('#row0 td')].forEach((column, i) => {
        if(i !== 0){
          if (column.addEventListener) {
           column.addEventListener('contextmenu', function(e) {
             COL_SELECTED = column;
             document.getElementById("colDropdown").classList.toggle("show");
             e.preventDefault();
           }, false);
         } else {
           column.attachEvent('oncontextmenu', function() {
               document.getElementById("colDropdown").classList.toggle("show");
             window.event.returnValue = false;
           });
         }
       
        window.onclick = function(event) {
           if (!event.target.matches('.dropbtn')) {
             var dropdowns = document.getElementsByClassName("column-content");
             var rowDropdowns = document.getElementsByClassName("dropdown-content");
       
             var openDropdown = dropdowns[0];
             var openColDropdown = rowDropdowns[0];
               if (openDropdown.classList.contains('show')) {
                 openDropdown.classList.remove('show');
               }
               if (openColDropdown.classList.contains('show')) {
                 openColDropdown.classList.remove('show');
               }
           }
        }
        }
    });
}

function addColumn() {
    let colSize = parseInt(localStorage["COLUMN_LEN"]) || 6;
    localStorage["COLUMN_LEN"] = colSize + 1;
    var colLetter = String.fromCharCode("A".charCodeAt(0)+(parseInt(localStorage["COLUMN_LEN"])-1)-1);
    [...document.querySelectorAll('table tr')].forEach((row, i) => {
        const input = document.createElement("input")
        input.setAttribute('id', colLetter+i)
        const cell = document.createElement(i ? "td" : "td");
        cell.innerHTML = i ? "<input id='"+ colLetter+i +"'/>" :  `
        <div class="dropdown">
            <div class="dropbtn">${colLetter}</div>
                <div class="column-content" id="colDropdown">
                <span onclick="addColumn()">Add Column</span>
                <span onclick="sortTable()">Sort</span>
            </div>
        </div>`;
        row.appendChild(cell);
    });

    insertCells();
    showColumnMenu();
}
showAddRowMenu();
showColumnMenu();



function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.querySelector("table");
    let index = [...document.querySelectorAll('#row0 td')].findIndex(ele => ele === COL_SELECTED);
    let finalIndex = index === -1 ? 1 : index;
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[finalIndex].getElementsByTagName('input')[0].value;
        y = rows[i + 1].getElementsByTagName("TD")[finalIndex].getElementsByTagName('input')[0].value;

        if (x.toLowerCase() > y.toLowerCase()) {
            shouldSwitch = true;
            break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }