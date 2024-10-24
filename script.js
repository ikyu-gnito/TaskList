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
  
      const task = todoList.find(task => task.id === id);
  
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
      tabs.push({ name: tabName, tasks: [] });
      renderTabs();
      closeNewTabModal();
      document.getElementById('tabName').value = '';
    }
    selectTab(tabs.length - 1); // seleciona a última aba criada
  }
  
  function renderTabs() {
    const tabList = document.getElementById('tabList');
    tabList.innerHTML = ''; // Limpa as abas existentes

    tabs.forEach((tab, index) => {
        const tabItem = document.createElement('li');
        tabItem.textContent = tab.name; // Nome da aba
        tabItem.onclick = () => selectTab(index); // Chama a função selectTab com o índice da aba
        tabList.appendChild(tabItem); // Adiciona a aba à lista
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
      id: Date.now(), // Usa timestamp como ID para garantir unicidade
      priority: $priorityInput.value,
      deadline: $deadlineInput.value,
      description: $descriptionInput.value,
      status: 'todo'
  };

  // Adiciona a nova tarefa à aba atualmente selecionada
  if (currentTabId !== null) {
      todoList[currentTabId].tasks.push(newTask);
  }

  saveToLocalStorage();
  closeModal();
  renderAllTasks();
}

function updateTask() {
    const taskId = Number($idInput.value);
    const index = todoList.findIndex(task => task.id === taskId);
    
    if (index !== -1) {
      todoList[index] = {
        ...todoList[index],
        priority: $priorityInput.value,
        deadline: $deadlineInput.value,
        description: $descriptionInput.value
      };
      saveToLocalStorage();
    }
  
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
  if (currentTabId !== null) {
    const currentTabTasks = todoList[currentTabId].tasks;
    const todoTasks = currentTabTasks.filter(task => task.status === 'todo');
    const inProgressTasks = currentTabTasks.filter(task => task.status === 'inProgress');
    const doneTasks = currentTabTasks.filter(task => task.status === 'done');

    document.querySelector('#todoColumn .body').innerHTML = todoTasks.map(generateCard).join('');
    document.querySelector('#inProgressColumn .body').innerHTML = inProgressTasks.map(generateCard).join('');
    document.querySelector('#doneColumn .body').innerHTML = doneTasks.map(generateCard).join('');
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
      renderAllTasks();
  }
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);