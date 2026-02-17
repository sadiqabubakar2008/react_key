let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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

displayTasks();

addBtn.addEventListener("click", addTask);

function addTask() {
  let text = taskInput.value;

  if (text === "") {
    return;
  }

  let task = {
    text: text,
    completed: false
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {

    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tasks[i].completed;

    checkbox.addEventListener("change", function () {
      tasks[i].completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    });

    let span = document.createElement("span");
    span.textContent = tasks[i].text;

    if (tasks[i].completed) {
      span.classList.add("completed");
    }

    let editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";

    editBtn.addEventListener("click", function () {

      let editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = tasks[i].text;

      li.replaceChild(editInput, span);
      editBtn.innerHTML = "💾";

      editBtn.onclick = function () {
        tasks[i].text = editInput.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
      };
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", function () {
      tasks.splice(i, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  }
}

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});