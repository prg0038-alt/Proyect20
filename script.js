// ============================
// VARIABLES GLOBALES
// ============================

let currentDate = new Date();
let selectedDate = null;

let notesByDate = {};
let allNotes = [];

let drawings = [];

let drawing = false;
let color = "black";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


// ============================
// CAMBIO DE PESTAÑAS (ARREGLADO)
// ============================
function showTab(tabId) {

    // oculta todas las pestañas
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    // muestra solo la seleccionada
    document.getElementById(tabId).classList.add("active");
}


// ============================
// INICIO CALENDARIO
// ============================
document.addEventListener("DOMContentLoaded", renderCalendar);


// ============================
// CREAR CALENDARIO
// ============================
function renderCalendar() {

    let calendar = document.getElementById("calendar");
    let monthYear = document.getElementById("monthYear");

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    let names = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

    monthYear.textContent = names[month] + " " + year;

    let days = new Date(year, month + 1, 0).getDate();

    let html = "";

    for (let i = 1; i <= days; i++) {

        let key = `${year}-${month}-${i}`;

        html += `<div class="day" onclick="selectDay('${key}')">${i}</div>`;
    }

    calendar.innerHTML = html;
}


// ============================
// CAMBIAR MES
// ============================
function changeMonth(step) {
    currentDate.setMonth(currentDate.getMonth() + step);
    renderCalendar();
}


// ============================
// SELECCIONAR DÍA
// ============================
function selectDay(date) {

    selectedDate = date;

    loadNotes();

    showTab("calendario");
}


// ============================
// NOTAS
// ============================
function addNote() {

    let input = document.getElementById("noteInput");

    if (!selectedDate || input.value.trim() === "") return;

    if (!notesByDate[selectedDate]) {
        notesByDate[selectedDate] = [];
    }

    let note = input.value;

    notesByDate[selectedDate].push(note);
    allNotes.push({ text: note, done: false });

    input.value = "";

    loadNotes();
    loadPending();
}


// cargar notas
function loadNotes() {

    let list = document.getElementById("notesList");

    list.innerHTML = "";

    if (!notesByDate[selectedDate]) return;

    notesByDate[selectedDate].forEach((n, i) => {

        let div = document.createElement("div");
        div.className = "note";

        div.innerHTML = `
            <span>${n}</span>
            <button onclick="deleteNote(${i})">X</button>
        `;

        list.appendChild(div);
    });
}


// borrar nota
function deleteNote(i) {
    notesByDate[selectedDate].splice(i, 1);
    loadNotes();
}


// ============================
// PENDIENTES
// ============================
function loadPending() {

    let list = document.getElementById("pendingList");

    list.innerHTML = "";

    allNotes.forEach((task, i) => {

        let div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <div>
                <input type="checkbox" onchange="toggleTask(${i})" ${task.done ? "checked" : ""}>
                <span style="text-decoration:${task.done ? 'line-through' : 'none'}">
                    ${task.text}
                </span>
            </div>
            <button onclick="deleteTask(${i})">X</button>
        `;

        list.appendChild(div);
    });
}


// marcar
function toggleTask(i) {
    allNotes[i].done = !allNotes[i].done;
    loadPending();
}


// borrar
function deleteTask(i) {
    allNotes.splice(i, 1);
    loadPending();
}


// ============================
// DIBUJO FLUIDO
// ============================

canvas.addEventListener("mousedown", e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", e => {

    if (!drawing) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});


// ============================
// CAMBIAR COLOR
// ============================
function setColor(c) {
    color = c;
}


// ============================
// LIMPIAR CANVAS
// ============================
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// ============================
// GUARDAR DIBUJO (ARREGLADO)
// ============================
function saveDrawing() {

    // convierte el canvas en imagen
    let img = canvas.toDataURL();

    // guarda en array
    drawings.push(img);

    // IMPORTANTE: actualizar pantalla
    loadDrawings();
}


// ============================
// MOSTRAR DIBUJOS (TE FALTABA ESTO)
// ============================
function loadDrawings() {

    let list = document.getElementById("drawingsList");

    list.innerHTML = "";

    drawings.forEach((img) => {

        let image = document.createElement("img");

        image.src = img;
        image.style.width = "100px";
        image.style.margin = "5px";
        image.style.border = "1px solid #ddd";

        list.appendChild(image);
    });
}


// ============================
// INICIAR DIBUJOS AL CARGAR
// ============================
document.addEventListener("DOMContentLoaded", loadDrawings);