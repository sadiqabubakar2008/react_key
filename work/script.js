let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let themeToggle = document.getElementById("themeToggle");
let filterButtons = document.querySelectorAll(".filter-btn");
let taskCounter = document.getElementById("taskCounter");

let MAX_WORDS = 10;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
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

function countWords(text) {
  return text.trim().split(/\s+/).filter(function (word) {
    return word !== "";
  }).length;
}

function addTask() {
  let text = taskInput.value.trim();
  if (text === "") return;

  if (countWords(text) > MAX_WORDS) {
    alert("Maximum " + MAX_WORDS + " words allowed!");
    return;
  }

  tasks.unshift({ text: text, completed: false });
  saveAndRender();
  taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    displayTasks();
  });
});

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(function (task) {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(function (task) {
    let realIndex = tasks.indexOf(task);
    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function () {
      tasks[realIndex].completed = checkbox.checked;
      saveAndRender();
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
        let newText = editInput.value.trim();
        if (newText === "") return;

        if (countWords(newText) > MAX_WORDS) {
          alert("Maximum " + MAX_WORDS + " words allowed!");
          return;
        }

        tasks[realIndex].text = newText;
        saveAndRender();
      };
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";

    deleteBtn.addEventListener("click", function () {
      tasks.splice(realIndex, 1);
      saveAndRender();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  let completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  let pending = tasks.length - completed;

  taskCounter.textContent =
    "Total: " + tasks.length +
    " | Completed: " + completed +
    " | Pending: " + pending;
}

displayTasks();