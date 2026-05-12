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
let brushSize = 2;

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

    //dias semana
    let weekDays = ["L", "M", "X", "J", "V", "S", "D"];

    //primer dia del mes
    let firstDay  = new Date(year, month, 1).getDay();

    //ajustar lunes primero
    firstDay  = firstDay  === 0 ? 6 : firstDay  - 1;

    //total dias mes
    let days = new Date(year, month + 1, 0).getDate();

    let html = "";
    //nombre semana
    weekDays.forEach(day => {
        html += `<div class="week-day">${day}</div>`;
    });

    //espacios vacios
    for(let i = 0; i < firstDay; i++){
        html+= '<div></div>';
    }

    //dias
    for (let i = 1; i <= days; i++) {

        let key = `${year}-${month}-${i}`;
        let isActive = selectedDate === key;

        html += `<div class="day ${isActive ? "active" : ""}" onclick="selectDay('${key}')">
                    <span>${i}</span>
                    ${notesByDate[key] ? `<div class="note-dot"></div>` : ""}
                </div>`;
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

    let noteObj = {
        id:Date.now(),
        text: input.value
    };

    notesByDate[selectedDate].push(noteObj);
    allNotes.push({
        id: noteObj.id,
        text: noteObj.text,
        done: false,
        date: selectedDate
    });

    input.value = "";

    loadNotes();
    loadPending();
    renderCalendar();
}


// cargar notas
function loadNotes() {

    let list = document.getElementById("notesList");

    list.innerHTML = "";

    if (!notesByDate[selectedDate]) return;

    notesByDate[selectedDate].forEach((n) => {

        let div = document.createElement("div");
        div.className = "note";

        div.innerHTML = `
            <span>${n.text}</span>
            <button onclick="deleteNote(${n.id})">X</button>
        `;

        list.appendChild(div);
    });
}


// borrar nota
function deleteNote(id) {

    //borrar para el calendario
    for (let date in notesByDate){
        notesByDate[date] = notesByDate[date].filter(n => n.id !== id);

        //Para poder borrar el punto si se borra la clave si esta vacia
        if(notesByDate[date].length === 0){
            delete notesByDate[date];
        }
    }

    //borrar de pendientes
    allNotes = allNotes.filter(n => n.id !== id);

    loadNotes();
    loadPending();
    renderCalendar();
}


// ============================
// PENDIENTES
// ============================
function loadPending() {

    let list = document.getElementById("pendingList");

    list.innerHTML = "";

    allNotes.forEach((task) => {

        let div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <div>
                <input type="checkbox" onchange="toggleTask(${task.id})" ${task.done ? "checked" : ""}>
                <span style="text-decoration:${task.done ? 'line-through' : 'none'}">
                    ${task.text}
                </span>
            </div>
            <button onclick="deleteTask(${task.id})">X</button>
        `;

        list.appendChild(div);
    });
}


// marcar
function toggleTask(id) {

    //buscar la tarea por id
    let task = allNotes.find(t => t.id === id);

    //si existe, cambiar estado
    if(task){
        task.done = !task.done;
    }

    loadPending();
    renderCalendar();
}


// borrar
function deleteTask(id) {

    let task = allNotes.find(t => t.id === id);

    //quitar del calendario
    if(!task) return;

    let date = task.date;

    //borrar de pendientes
    allNotes = allNotes.filter(t => t.id !== id);

    //borrar del calendario
    if(notesByDate[date]) {
        notesByDate[date] = notesByDate[date].filter(n => n.id !== id);

        if (notesByDate[date].length === 0) {
            delete notesByDate[date];
        }
    }

    loadNotes();
    loadPending();
    renderCalendar();
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

    //Grosor
    ctx.lineWidth = brushSize;

    //Para suavizar la lineas
    ctx.lineCap = "round";

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
// CAMBIAR GROSOR DEL PINCEL
// ============================
function setBrushSize(size){
    brushSize = size;
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