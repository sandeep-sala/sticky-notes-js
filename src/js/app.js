var cards_list = {};

document.querySelector("#add-card").addEventListener('click', function() {
    createCard("", {
        title: "",
        content: "",
        top: "",
        left: "",
    });
}, false);

function generateId(n) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function setStorage() {
    localStorage.setItem('notes', JSON.stringify(cards_list));
}

function getStorage() {
    cards_list = JSON.parse(localStorage.getItem('notes')) || {};
}

function createCard(id, data) {
    id = id || generateId(15);
    let board = document.querySelector("#board");
    let card = document.createElement("div");
    card.className = "card";
    card.id = id;
    card.innerHTML = `
    <div class="card-header">
        <span class="card-close">&#10006;</span>
    </div>
    <div  class="card-content">
    <h3 class="card-content-header" contenteditable="true" placeholder="Enter title here...">${data.title}</h3>
    <div class="card-content-data" contentEditable="true" >${data.content}</div>
    </div>
    `;
    dragElement(card);
    board.appendChild(card);
    if (data.top == "") {
        card.style.top = `${(window.innerHeight - card.offsetHeight) / 2}px`;
        data.top = card.style.top;
    } else {
        card.style.top = data.top;
    }
    if (data.left == "") {
        card.style.left = `${(window.innerWidth - card.offsetWidth) / 2}px`;
        data.left = card.style.left;
    } else {
        card.style.left = data.left;
    }
    cards_list[id] = data;
    setStorage();
}

function dragElement(elmnt) {
    var pos1 = 0
      , pos2 = 0
      , pos3 = 0
      , pos4 = 0;

    elmnt.onclick = activateCard;
    elmnt.querySelector(".card-close").onclick = removeCard;
    elmnt.querySelector(".card-header").onmousedown = dragMouseDown;

    elmnt.querySelector(".card-content-header").oninput = saveCardHeader;
    elmnt.querySelector(".card-content-data").oninput = saveCardContent;

    function activateCard() {
        document.querySelectorAll(".card").forEach(element=>{
            element.classList.remove("active");
        }
        );
        elmnt.classList.add("active");
    }

    function removeCard(e) {
        elmnt.remove();
        delete cards_list[elmnt.id];
        setStorage();
    }

    function saveCardHeader(e) {
        cards_list[elmnt.id]["title"] = e.target.innerHTML;
        setStorage();
    }

    function saveCardContent(e) {
        cards_list[elmnt.id]["content"] = e.target.innerHTML;
        setStorage();
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let new_top = (elmnt.offsetTop - pos2)
        let new_left = (elmnt.offsetLeft - pos1)

        if ((new_top >= 0) && (new_top <= (window.innerHeight - elmnt.offsetHeight))) {
            elmnt.style.top = new_top + "px";
            cards_list[elmnt.id]["top"] = elmnt.style.top;
        }
        if ((new_left >= 0) && (new_left <= (window.innerWidth - elmnt.offsetWidth))) {
            elmnt.style.left = new_left + "px";
            cards_list[elmnt.id]["left"] = elmnt.style.left;
        }
        setStorage();
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

window.onload = function() {
    getStorage();
    Object.entries(cards_list).forEach(item=>{
        createCard(item[0], item[1]);
    }
    );
}
;
