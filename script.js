const $modal = document.getElementById('modal');
const $priorityInput = document.getElementById('priority');
const $deadlineInput = document.getElementById('deadline');
const $descriptionInput = document.getElementById('description');
const $todoColumn = document.querySelector('#todoColumn .body');
const $idInput = document.getElementById('idInput');
const $createTitle = document.getElementById('createTitle');
const $editTitle = document.getElementById('editTitle');
const $addTask = document.getElementById('addTask');
const $editTask = document.getElementById('editTask');

// lista que vai receber os valores das tasks
var todoList = [];

function openModal(id) {
    $modal.style.display = "flex";

    if (id){
        $createTitle.style.display = "none";
        $editTitle.style.display = "block";

        $addTask.style.display = "none";
        $editTask.style.display = "block";

        const index = todoList.findIndex(function(task) {
            return task.id;
        });

        const task = todoList[index];

        $idInput.value = task.id;
        $descriptionInput.value = task.description;
        $priorityInput.value = task.priority;
        $deadlineInput.value = task.deadline;
    }else{
        $createTitle.style.display = "block";
        $editTitle.style.display = "none";

        $addTask.style.display = "block";
        $editTask.style.display = "none";
    }
}

function closeModal() {
    $modal.style.display = "none";

    $idInput.value = "";
    $descriptionInput.value = "";
    $priorityInput.value = "";
    $deadlineInput.value = "";
}

function generateCard(){
    const todoListhtml = todoList.map(function(task){
        const formatedDate = moment(task.deadline).format('DD/MM/YYYY')
        return `
            <div class = "card" ondblclick ="openModal(${task.id})" draggable = "true" ondragstart = "dragstart_handler(event)">
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

    $todoColumn.innerHTML = todoListhtml.join('');
}

// cria task e adiciona na lista
function createTask() {
    const newTask = {
        id: Math.floor(Math.random()*9999999999),
        priority: $priorityInput.value,
        deadline: $deadlineInput.value,
        description: $descriptionInput.value
    }
    todoList.push(newTask);

    closeModal();
    generateCard();
}

function updateTask(){
    const Task = {
        id: $idInput.value,
        priority: $priorityInput.value,
        deadline: $deadlineInput.value,
        description: $descriptionInput.value
    }

    const index = todoList.findIndex(function(task) {
        return task.id = $idInput.value;
    });

    todoList[index] = Task;

    closeModal();
    generateCard();
}

function dragstart_handler(ev){
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}