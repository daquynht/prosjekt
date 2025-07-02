let taskIdCounter = 0;
let currentEditingTask = null;

// Dra og slipp
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const task = document.getElementById(data);
  const taskList = ev.target.closest(".task-list");
  if (taskList) {
    taskList.appendChild(task);
    updateTaskColor(task, taskList.parentElement.id);
  }
}

function updateTaskColor(task, columnId) {
  task.classList.remove("todo-color", "inprogress-color", "done-color");
  if (columnId === "todo") {
    task.classList.add("todo-color");
  } else if (columnId === "inprogress") {
    task.classList.add("inprogress-color");
  } else if (columnId === "done") {
    task.classList.add("done-color");
  }
}

// Legg til ny oppgave
function addTask(button) {
  const column = button.parentElement;
  const input = column.querySelector(".new-task-input");
  const title = input.value.trim();
  if (!title) return;

  const task = document.createElement("div");
  task.className = "task";
  task.id = "task-" + taskIdCounter++;
  task.draggable = true;

  // Start med bare tittel, beskrivelse og tag tomme
  task.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <strong>${title}</strong>
      <button class="delete-btn" title="Slett oppgave" aria-label="Slett oppgave">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#c0392b" viewBox="0 0 24 24">
          <path d="M3 6h18M9 6v12a1 1 0 0 0 2 0V6M14 6v12a1 1 0 0 0 2 0V6M19 6v12a3 3 0 0 1-6 0V6m5-3H8a2 2 0 0 0-2 2v1h12V5a2 2 0 0 0-2-2z"/>
        </svg>
      </button>
    </div>`;

  task.addEventListener("dragstart", drag);
  task.addEventListener("click", () => openEditPopup(task));

  const taskList = column.querySelector(".task-list");
  taskList.appendChild(task);
  updateTaskColor(task, column.id);

  // Legg på slett-knapp event listener
  const deleteBtn = task.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Forhindre at popup åpnes ved sletting
    if (confirm("Vil du slette denne oppgaven?")) {
      task.remove();
      if (currentEditingTask === task) closeEditPopup();
    }
  });

  input.value = "";
}

// Popup: Åpne og lukke
function openEditPopup(task) {
  currentEditingTask = task;
  const desc = task.querySelector("p")?.textContent || "";
  const tag = task.querySelector(".tag")?.textContent || "";

  document.getElementById("edit-desc").value = desc;
  document.getElementById("edit-tag").value = tag;
  document.getElementById("edit-popup").classList.remove("hidden");
}

function closeEditPopup() {
  document.getElementById("edit-popup").classList.add("hidden");
  currentEditingTask = null;
}

// Lagre endringer
document.getElementById("save-edit-btn").addEventListener("click", () => {
  if (!currentEditingTask) return;

  const desc = document.getElementById("edit-desc").value.trim();
  const tag = document.getElementById("edit-tag").value.trim();
  const title = currentEditingTask.querySelector("strong")?.textContent || "";

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <strong>${title}</strong>
      <button class="delete-btn" title="Slett oppgave" aria-label="Slett oppgave">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#c0392b" viewBox="0 0 24 24">
          <path d="M3 6h18M9 6v12a1 1 0 0 0 2 0V6M14 6v12a1 1 0 0 0 2 0V6M19 6v12a3 3 0 0 1-6 0V6m5-3H8a2 2 0 0 0-2 2v1h12V5a2 2 0 0 0-2-2z"/>
        </svg>
      </button>
    </div>`;

  if (desc) html += `<p>${desc}</p>`;
  if (tag) html += `<span class="tag">${tag}</span>`;

  currentEditingTask.innerHTML = html;

  currentEditingTask.addEventListener("dragstart", drag);
  currentEditingTask.addEventListener("click", () => openEditPopup(currentEditingTask));

  const deleteBtn = currentEditingTask.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Vil du slette denne oppgaven?")) {
      currentEditingTask.remove();
      closeEditPopup();
    }
  });

  closeEditPopup();
});

// Event listeners for dra/slipp og legg til-knapper
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".task-list").forEach(list => {
    list.addEventListener("dragover", allowDrop);
    list.addEventListener("drop", drop);
  });

  document.querySelectorAll(".add-task-btn").forEach(button => {
    button.addEventListener("click", () => addTask(button));
  });
});
