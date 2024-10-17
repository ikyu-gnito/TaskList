const $modal = document.getElementById("modal");
const $priorityInput = document.getElementById("priority");
const $deadlineInput = document.getElementById("deadline");
const $descriptionInput = document.getElementById("description");
const $todoColumn = document.querySelector("#todoColumn .body");
const $idInput = document.getElementById("idInput");
const $createTitle = document.getElementById("createTitle");
const $editTitle = document.getElementById("editTitle");
const $addTask = document.getElementById("addTask");
const $editTask = document.getElementById("editTask");

// lista que vai receber os valores das tasks
var todoList = [];

function openModal(id) {
  $modal.style.display = "flex";

  if (id) {
    $createTitle.style.display = "none";
    $editTitle.style.display = "block";

    $addTask.style.display = "none";
    $editTask.style.display = "block";

    const index = todoList.findIndex(function (task) {
      return task.id == id;
    });

    const task = todoList[index];

    $idInput.value = task.id;
    $descriptionInput.value = task.description;
    $priorityInput.value = task.priority;
    $deadlineInput.value = task.deadline;
  } else {
    $createTitle.style.display = "block";
    $editTitle.style.display = "none";

    $addTask.style.display = "block";
    $editTask.style.display = "none";

    $idInput.value = "";
    $descriptionInput.value = "";
    $priorityInput.value = "";
    $deadlineInput.value = "";
  }
}

function closeModal() {
  $modal.style.display = "none";

  $idInput.value = "";
  $descriptionInput.value = "";
  $priorityInput.value = "";
  $deadlineInput.value = "";
}

function generateCard(task) {
  const todoListhtml = todoList.map(function (task) {
    const formatedDate = moment(task.deadline).format("DD/MM/YYYY");
    return `
            <div class = "card" id="task-${task.id}" data-id="${task.id}" ondblclick ="openModal(${task.id})" draggable = "true" ondragstart = "drag(event)">
                <div class = "info">
                    <b>Prioridade:</b>
                    <span>${task.priority}</span>
                </div>
                <div class = "info">
                    <b>Prazo:</b>
                    <span>${formatedDate}</span>
                </div>
                <div class = "info">
                    <b>Descrição:</b>
                    <span>${task.description}</span>
                </div>
            </div>
        `;
  });

  $todoColumn.innerHTML = todoListhtml.join("");
}

// cria task e adiciona na lista
function createTask() {
  const newTask = {
    id: Math.floor(Math.random() * 9999999999),
    priority: $priorityInput.value,
    deadline: $deadlineInput.value,
    description: $descriptionInput.value,
    status: "todo",
  };
  todoList.push(newTask);

  closeModal();
  renderAllTasks();
}

function updateTask() {
  const Task = {
    id: $idInput.value,
    priority: $priorityInput.value,
    deadline: $deadlineInput.value,
    description: $descriptionInput.value,
  };

  const index = todoList.findIndex(function (task) {
    return task.id == Number($idInput.value);
  });

  todoList[index] = Task;

  closeModal();
  renderAllTasks();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var draggedElement = document.getElementById(data);
  ev.target
    .closest(".column")
    .querySelector(".body")
    .appendChild(draggedElement);

  // Atualizar o status da tarefa na lista
  const taskId = draggedElement.getAttribute("data-id");
  const newStatus = ev.target.closest(".column").id.replace("Column", "");
  updateTaskStatus(taskId, newStatus);
}

function updateTaskStatus(taskId, newStatus) {
  const index = todoList.findIndex((task) => task.id == taskId);
  if (index !== -1) {
    todoList[index].status = newStatus;
  }
  renderAllTasks();
}

function renderAllTasks() {
  const todoTasks = todoList.filter((task) => task.status === "todo");
  const inProgressTasks = todoList.filter(
    (task) => task.status === "inProgress"
  );
  const doneTasks = todoList.filter((task) => task.status === "done");

  $todoColumn.querySelector("#todoColumn .body").innerHTML = todoTasks
    .map(generateCard)
    .join("");
  $inProgressColumn.querySelector("#inProgressColumn .body").innerHTML = inProgressTasks
    .map(generateCard)
    .join("");
  $doneColumn.querySelector("doneColumn .body").innerHTML = doneTasks
    .map(generateCard)
    .join("");
}
