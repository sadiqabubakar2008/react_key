let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";

    deleteBtn.addEventListener("click", function () {
      tasks.splice(i, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  }
}
