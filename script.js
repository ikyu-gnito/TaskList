const $modal = document.getElementById("modal");
const $descriptionInput = document.getElementById("description");
const $priorityInput = document.getElementById("priority");
const $deadlineInput = document.getElementById("deadline");

const $todoColumnBody = document.querySelector("#todoColumn .body");

var todoList = [];

function openModal() {
  $modal.style.display = "flex";
}
function closeModal() {
  $modal.style.display = "none";
}

function generateCards() {
  const todoListHtml = todoList.map(function (task) {
    return `
        <div class = "card">
            <div class="info">
                <b>Prioridade</b>
                <span>${task.$priority}</span>
        	</div>

            <div class="info">
                <b>Data</b>
                <span>${task.$deadline}</span>
            </div>

            <div class="info">
                <b>Descrição</b>
                <span>${task.$description}</span>
            </div>
        `;
  });

  $todoColumnBody.innerHTML = todoListHtml.join('');
}

function createTask() {
  const newTask = {
    $priority: $priorityInput.value,
    $deadline: $deadlineInput.value,
    $description: $descriptionInput.value,
  };

  todoList.push(newTask);
  console.log(todoList);

  closeModal();
  generateCards();
}
