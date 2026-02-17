let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let themeToggle = document.getElementById("themeToggle");
let filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach(button => {
  button.addEventListener("click", function () {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    displayTasks();
  });
});

displayTasks();

function addTask() {
  let text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text: text, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {

    let realIndex = tasks.indexOf(task);

    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function () {
      tasks[realIndex].completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    });

    let span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    let editBtn = document.createElement("button");
    editBtn.textContent = "✏️";

    editBtn.addEventListener("click", function () {
      let editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = task.text;

      li.replaceChild(editInput, span);
      editBtn.textContent = "💾";

      editBtn.onclick = function () {
        tasks[realIndex].text = editInput.value.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
      };
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", function () {
      tasks.splice(realIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}
