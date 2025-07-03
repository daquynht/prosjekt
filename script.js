let taskIdCounter = 0;
let currentEditingTask = null;

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

function addTask(button) {
  const column = button.parentElement;
  const input = column.querySelector(".new-task-input");
  const title = input.value.trim();
  if (!title) return;

  const task = document.createElement("div");
  task.className = "task";
  task.id = "task-" + taskIdCounter++;
  task.draggable = true;
  task.addEventListener("dragstart", drag);
  task.innerHTML = `
  <div class="task-header">
    <div class="left-controls">
      <button class="edit-btn" title="Rediger">✎</button>
      <strong>${title}</strong>
    </div>
    <button class="delete-btn" title="Slett">×</button>
  </div>
`;


  task.querySelector(".edit-btn").addEventListener("click", () => openEditPopup(task));
  task.querySelector(".delete-btn").addEventListener("click", () => task.remove());

  column.querySelector(".task-list").appendChild(task);
  updateTaskColor(task, column.id);
  input.value = "";
}

document.querySelectorAll(".task-list").forEach(list => {
  list.addEventListener("dragover", allowDrop);
  list.addEventListener("drop", drop);
});

document.querySelectorAll(".add-task-btn").forEach(button => {
  button.addEventListener("click", () => addTask(button));
});

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

document.getElementById("save-edit-btn").addEventListener("click", () => {
  if (!currentEditingTask) return;

  const desc = document.getElementById("edit-desc").value.trim();
  const tag = document.getElementById("edit-tag").value.trim();
  const title = currentEditingTask.querySelector("strong")?.textContent || "";

  let html = `
  <div class="task-header">
    <div class="left-controls">
      <button class="edit-btn" title="Rediger">✎</button>
      <strong>${title}</strong>
    </div>
    <button class="delete-btn" title="Slett">×</button>
  </div>
`;

if (desc) html += `<p>${desc}</p>`;
if (tag) html += `<span class="tag">${tag}</span>`;


  currentEditingTask.innerHTML = html;
  currentEditingTask.addEventListener("dragstart", drag);

  currentEditingTask.querySelector(".edit-btn").addEventListener("click", () => openEditPopup(currentEditingTask));
  currentEditingTask.querySelector(".delete-btn").addEventListener("click", () => currentEditingTask.remove());

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
