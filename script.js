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
let tabs = [];
let currentTabId = null;
// lista que vai receber os valores das tasks
var todoList = tabs.map(tab => ({ id: tab.id, tasks: [] }));

function openNewTabModal() {
  document.getElementById('newTabModal').style.display = 'flex';
}

function closeNewTabModal() {
  document.getElementById('newTabModal').style.display = 'none';
}


function openModal(id) {
  $modal.style.display = "flex";

  if (id) {
    $createTitle.style.display = "none";
    $editTitle.style.display = "block";
    $addTask.style.display = "none";
    $editTask.style.display = "block";

    const task = todoList[currentTabId].tasks.find(task => task.id === id);

    if (task) {
      $idInput.value = task.id;
      $descriptionInput.value = task.description;
      $priorityInput.value = task.priority;
      $deadlineInput.value = task.deadline;
    }
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

  function createTab() {
    const tabName = document.getElementById('tabName').value;
    if (tabName) {
      const tabId = tabs.length;
      tabs.push({ id: tabId, name: tabName, tasks: [] });
      todoList.push({ id: tabId, tasks: [] });
      renderTabs();
      closeNewTabModal();
    }
    selectTab(tabs.length - 1); // seleciona a última aba criada
  }
  
  function renderTabs() {
    const $tabList = document.getElementById('tabList');
    $tabList.innerHTML = '';
  
    tabs.forEach((tab, index) => {
      const $tab = document.createElement('li');
      $tab.textContent = tab.name;
      $tab.addEventListener('click', () => {
        currentTabId = index;
        renderAllTasks();
      });
      $tabList.appendChild($tab);
    });
}

  function selectTab(tabId) {
    currentTabId = tabId; // Define a aba atualmente selecionada
    renderAllTasks(); // Renderiza as tarefas da aba selecionada
}

function closeModal() {
  $modal.style.display = "none";

  $idInput.value = "";
  $descriptionInput.value = "";
  $priorityInput.value = "";
  $deadlineInput.value = "";
}

function generateCard(task) {
    const formatedDate = moment(task.deadline).format('DD/MM/YYYY');
    return `
      <div class="card" id="task-${task.id}" data-id="${task.id}" draggable="true" ondragstart="drag(event)">
        <div class="card-header">
          <span class="edit-btn" onclick="openModal(${task.id})">Editar</span>
          <span class="delete-btn" onclick="deleteTask(${task.id})"><i class="fa-solid fa-rectangle-xmark xmark"></i></span>
        </div>
        <div class="info">
          <b>Prioridade:</b>
          <span>${task.priority}</span>
        </div>
        <div class="info">
          <b>Prazo:</b>
          <span>${formatedDate}</span>
        </div>
        <div class="info">
          <b>Descrição:</b>
          <span>${task.description}</span>
        </div>
      </div>
    `;
}

// cria task e adiciona na lista
function createTask() {
  const newTask = {
    id: Date.now(),
    priority: $priorityInput.value,
    deadline: $deadlineInput.value,
    description: $descriptionInput.value,
    status: 'todo'
  };

  if (currentTabId !== null) {
    todoList[currentTabId].tasks.push(newTask);
  } else {
    alert("Selecione uma aba antes de criar uma tarefa.");
    return;
  }

  saveToLocalStorage();
  closeModal();
  renderAllTasks();
}

function updateTask() {
  const id = $idInput.value;
  const task = todoList[currentTabId].tasks.find(task => task.id === parseInt(id));

  if (task) {
    task.description = $descriptionInput.value;
    task.priority = $priorityInput.value;
    task.deadline = $deadlineInput.value;
  }

  saveToLocalStorage();
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
  if (currentTabId !== null) {
    const index = todoList[currentTabId].tasks.findIndex((task) => task.id == taskId);
    if (index !== -1) {
      todoList[currentTabId].tasks[index].status = newStatus;
      saveToLocalStorage();
    }
    renderAllTasks();
  }
}
function renderAllTasks() {
  $todoColumn.innerHTML = '';
  $inProgressColumn.innerHTML = '';
  $doneColumn.innerHTML = '';

  if (currentTabId !== null) {
    todoList[currentTabId].tasks.forEach(task => {
      const $task = document.createElement('div');
      $task.textContent = task.description;
      switch (task.status) {
        case 'todo':
          $todoColumn.appendChild($task);
          break;
        case 'inProgress':
          $inProgressColumn.appendChild($task);
          break;
        case 'done':
          $doneColumn.appendChild($task);
          break;
      }
    });
  }
}

function deleteTask(id) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      if (currentTabId !== null) {
          const index = todoList[currentTabId].tasks.findIndex(task => task.id === id);
          if (index !== -1) {
              todoList[currentTabId].tasks.splice(index, 1);
              saveToLocalStorage();
              renderAllTasks();
          }
      }
  }
}


function saveToLocalStorage() {
  localStorage.setItem('tabs', JSON.stringify(tabs));
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function loadFromLocalStorage() {
  const savedTabs = localStorage.getItem('tabs');
  const savedTodoList = localStorage.getItem('todoList');
  if (savedTabs) {
      tabs = JSON.parse(savedTabs);
  }
  if (savedTodoList) {
      todoList = JSON.parse(savedTodoList);
  } else {
      todoList = tabs.map(tab => ({ id: tab.id, tasks: [] })); // Inicialize aqui
  }
  renderAllTasks();
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);