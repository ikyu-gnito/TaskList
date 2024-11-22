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

const $sidebarAddBtn = document.querySelector('.sidebar-add');
const $sidebarList = document.querySelector('.sidebar ul');


// lista que vai receber os valores das tasks
var todoList = [];

function openModal(id) {
  $modal.style.display = "flex";
  if (!currentFolderId) {
      alert("Por favor, selecione uma pasta primeiro.");
      return;
  }
  if (id) {
      $createTitle.style.display = "none";
      $editTitle.style.display = "block";
      $addTask.style.display = "none";
      $editTask.style.display = "block";

      const folderIndex = folders.findIndex(folder => folder.id === currentFolderId);
      const task = folders[folderIndex].tasks.find(task => task.id === id); // Certifique-se de que está buscando na pasta correta

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
        <input type="text" class="task-title" value="${task.title}" onblur="updateTaskTitle(${task.id}, this.value)" />
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
  if (!currentFolderId) {
      alert("Por favor, selecione uma pasta primeiro.");
      return; // Adicione esta linha para impedir que o modal seja aberto
  }
  const newTask = {
      id: Date.now(),
      title: $titleInput.value, // Novo campo para título
      priority: $priorityInput.value,
      deadline: $deadlineInput.value,
      description: $descriptionInput.value,
      status: 'todo'
  };
  const folderIndex = folders.findIndex(folder => folder.id === currentFolderId);
  folders[folderIndex].tasks.push(newTask);
  saveToLocalStorage();
  closeModal();
  renderAllTasks();
}

function updateTask() {
  if (!currentFolderId) return; // Verifica se uma pasta está selecionada
  const taskId = Number($idInput.value); // Obtém o ID da tarefa a partir do campo oculto
  const folderIndex = folders.findIndex(folder => folder.id === currentFolderId);
  const taskIndex = folders[folderIndex].tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
      folders[folderIndex].tasks[taskIndex] = {
          ...folders[folderIndex].tasks[taskIndex],
          priority: $priorityInput.value,
          deadline: $deadlineInput.value,
          description: $descriptionInput.value
      };
      saveToLocalStorage(); // Salva as alterações
      closeModal(); // Fecha o modal após salvar
      renderAllTasks(); // Renderiza as tarefas novamente
  } else {
      alert("Tarefa não encontrada!");
  }
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
  if (!currentFolderId) return;
  const folderIndex = folders.findIndex(folder => folder.id === currentFolderId);
  const taskIndex = folders[folderIndex].tasks.findIndex(task => task.id == taskId);
  if (taskIndex !== -1) {
      folders[folderIndex].tasks[taskIndex].status = newStatus;
      saveToLocalStorage();
  }
  renderAllTasks();
}

function renderAllTasks() {
  if (!currentFolderId) {
      document.querySelector('#todoColumn .body').innerHTML = '';
      document.querySelector('#inProgressColumn .body').innerHTML = '';
      document.querySelector('#doneColumn .body').innerHTML = '';
      return;
  }
  const currentFolder = folders.find(folder => folder.id === currentFolderId);
  const todoTasks = currentFolder.tasks.filter(task => task.status === 'todo');
  const inProgressTasks = currentFolder.tasks.filter(task => task.status === 'inProgress');
  const doneTasks = currentFolder.tasks.filter(task => task.status === 'done');

  document.querySelector('#todoColumn .body').innerHTML = todoTasks.map(generateCard).join('');
  document.querySelector('#inProgressColumn .body').innerHTML = inProgressTasks.map(generateCard).join('');
  document.querySelector('#doneColumn .body').innerHTML = doneTasks.map(generateCard).join('');
}

function deleteTask(id) {
  if (!currentFolderId) return; // Verifica se uma pasta está selecionada
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      const folderIndex = folders.findIndex(folder => folder.id === currentFolderId);
      folders[folderIndex].tasks = folders[folderIndex].tasks.filter(task => task.id !== id);
      saveToLocalStorage(); // Salva as alterações
      renderAllTasks(); // Renderiza as tarefas novamente
  }
}


function saveToLocalStorage() {
  localStorage.setItem('folders', JSON.stringify(folders));
}

function loadFromLocalStorage() {
  const savedFolders = localStorage.getItem('folders');
  if (savedFolders) {
      folders = JSON.parse(savedFolders);
      renderFolders();
  }
}
let folders = [];
let currentFolderId = null;

function createFolder() {
  const folderName = prompt("Digite o nome da nova pasta:");
  if (folderName) {
      const newFolder = {
          id: Date.now(),
          name: folderName,
          tasks: [] // Inicializa com uma lista vazia de tarefas
      };
      folders.push(newFolder);
      saveFoldersToLocalStorage();
      renderFolders();
      
      // Selecione a nova pasta e renderize as tarefas
      currentFolderId = newFolder.id; // Atualiza o currentFolderId para a nova pasta
      renderAllTasks(); // Renderiza as tarefas da nova pasta
  }
}

// Função para renderizar as pastas
function renderFolders() {
  $sidebarList.innerHTML = folders.map(folder => `
      <li>
          <i class="fa fa-folder folder"></i>
          <a href="#" onclick="switchFolder(${folder.id})">${folder.name}</a>
          <i class="fa fa-ellipsis-h folder-settings" onclick="showFolderOptions(${folder.id})"></i>
      </li>
  `).join('');
}

function switchFolder(folderId) {
  currentFolderId = folderId;
  renderAllTasks();
}

// Função para mostrar opções da pasta
function showFolderOptions(folderId) {
  // Primeiro, remova qualquer popup existente
  const existingPopup = document.querySelector('.folder-options-popup');
  if (existingPopup) {
      existingPopup.remove(); // Remove o popup existente
  }

  const popup = document.createElement('div');
  popup.className = 'folder-options-popup';
  popup.innerHTML = `
      <button onclick="deleteFolder(${folderId})">Deletar</button>
  `;
  
  const folderElement = document.querySelector(`[onclick="showFolderOptions(${folderId})"]`);
  folderElement.appendChild(popup);
  
  // Remover o popup após um clique fora dele
  document.addEventListener('click', function removePop(e) {
      if (!popup.contains(e.target) && e.target !== folderElement) {
          popup.remove();
          document.removeEventListener('click', removePop);
      }
  });
}

// Função para deletar uma pasta
function deleteFolder(folderId) {
    if (confirm('Tem certeza que deseja excluir esta pasta?')) {
        folders = folders.filter(folder => folder.id !== folderId);
        renderFolders();
        saveFoldersToLocalStorage();
    }
}

// Função para salvar pastas no localStorage
function saveFoldersToLocalStorage() {
    localStorage.setItem('folders', JSON.stringify(folders));
}

// Função para carregar pastas do localStorage
function loadFoldersFromLocalStorage() {
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
        folders = JSON.parse(savedFolders);
        renderFolders();
    }
}
function updateTaskTitle(taskId, newTitle) {
  if (!currentFolderId) return; // Verifica se uma pasta está selecionada
  const folderIndex = folders.findIndex(folder => folder.id === currentFolderId);
  const taskIndex = folders[folderIndex].tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
      folders[folderIndex].tasks[taskIndex].title = newTitle; // Atualiza o título da tarefa
      saveToLocalStorage(); // Salva as alterações
      renderAllTasks(); // Renderiza as tarefas novamente
  } else {
      alert("Tarefa não encontrada!");
  }
}

document.getElementById('addTaskButton').addEventListener('click', function() {
  if (!currentFolderId) {
      alert("Por favor, selecione uma pasta primeiro.");
      return; // Impede que o modal seja aberto
  }
  openModal(); // Abre o modal apenas se uma pasta estiver selecionada
});

// Adicione estes event listeners
$sidebarAddBtn.addEventListener('click', createFolder);
document.addEventListener('DOMContentLoaded', loadFoldersFromLocalStorage);

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);