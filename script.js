console.log("Kjør prosjektstyring!");
console.log("Kjør prosjektstyring!");

let taskIdCounter = 0;

// Funksjon som tillater drop
function allowDrop(ev) {
  ev.preventDefault();
}

// Funksjon som starter dragging
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

// Funksjon som håndterer drop
function drop(ev) {
  ev.preventDefault();

  const data = ev.dataTransfer.getData("text");
  const task = document.getElementById(data);

  // Finn nærmeste task-list fra drop-målet og legg til task
  const taskList = ev.target.closest(".task-list");
  if (taskList) {
    taskList.appendChild(task);
  }
}

// Legg til event listeners på alle task-lister for drop/dragover
const taskLists = document.querySelectorAll(".task-list");
taskLists.forEach(list => {
  list.addEventListener("dragover", allowDrop);
  list.addEventListener("drop", drop);
});

// Funksjon for å legge til ny oppgave i en kolonne
function addTask(button) {
  // Finn input-feltet som hører til denne knappen
  const column = button.parentElement;
  const input = column.querySelector(".new-task-input");
  const taskText = input.value.trim();

  if (!taskText) return;

  const taskList = column.querySelector(".task-list");

  const task = document.createElement("div");
  task.className = "task";
  task.textContent = taskText;

  task.id = "task-" + taskIdCounter++;
  task.draggable = true;
  task.addEventListener("dragstart", drag);

  taskList.appendChild(task);

  input.value = "";
}

// Legg til event listeners på alle "Legg til" knapper
const addButtons = document.querySelectorAll(".add-task-btn");
addButtons.forEach(button => {
  button.addEventListener("click", () => addTask(button));
});
