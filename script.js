// Get all columns and cards
const columns = document.querySelectorAll('.column');
const cards = document.querySelectorAll('.card');

// Add event listener to the "Add" button
document.querySelectorAll('.add').forEach((addBtn) => {
  addBtn.addEventListener('click', addCard);
});

function addCard(event) {
  const column = event.target.closest('.column');
  const newCard = createCard();
  column.appendChild(newCard);
  event.target.parentNode.appendChild(event.target); // move the "Add" button below the new card
}

function createCard() {
  const newCard = document.createElement('div');
  newCard.className = 'card';
  newCard.draggable = true;
  newCard.innerHTML = `
    <h3 class="card-title" contenteditable="true">New Task</h3>
    <i class="fa fa-star fav"></i>
  `;
  return newCard;
}

// Add event listeners for drag and drop
columns.forEach((column) => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    const card = document.querySelector('.card[draggable="true"]');
    column.appendChild(card);
    const addBtn = column.querySelector('.add');
    column.appendChild(addBtn); // move the "Add" button below the dropped card
  });
});

cards.forEach((card) => {
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text', card.outerHTML);
  });
});

columns.forEach((column) => {
  column.addEventListener('dragenter', (e) => {
    e.preventDefault();
  });
});