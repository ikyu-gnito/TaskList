const $modal = document.getElementById('modal');
const $priorityInput = document.getElementById('priority');
const $deadlineInput = document.getElementById('deadline');
const $descriptionInput = document.getElementById('description');
const $todoColumn = document.querySelector('#todoColumn .body');

// lista que vai receber os valores das tasks
var todoList = [];

function openModal() {
    $modal.style.display = "flex";
}

function closeModal() {
    $modal.style.display = "none";
}

function generateCard(){
    const todoListhtml = todoList.map(function(task){
        return `
            <div class = "card">
                <div class = "info">
                    <b>Prioridade:</b>
                    <span>${task.priority}</span>
                </div>
                <div class = "info">
                    <b>Prazo:</b>
                    <span>${task.deadline}</span>
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
        priority: $priorityInput.value,
        deadline: $deadlineInput.value,
        description: $descriptionInput.value
    }
    todoList.push(newTask);

    closeModal();
    generateCard();
}