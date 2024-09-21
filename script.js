// Seleciona todas as divs com classe card
const cards = document.querySelectorAll('.card');
// Seleciona os botoes com classe add
const addBtns = document.querySelectorAll('.add');

// Adiciona evento de dragstart a cada card
cards.forEach((card) => {
    card.addEventListener('dragstart', (e) => {
        // Define o tipo de dados a serem transferidos
        e.dataTransfer.setData('text/plain', card.id);
    });
});

// Adiciona evento de dragover e drop a cada coluna
const columns = document.querySelectorAll('.column');
columns.forEach((column) => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);
        column.appendChild(card);
    });
});

addBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.draggable = true;
        newCard.innerHTML = `
      <h3 class="card-title contenteditable="true">Novo card</h3>
      <i class="fa fa-star fav" aria-hidden="true"></i>
    `;

        const column = btn.parentNode;
        column.appendChild(newCard);

        btn.parentNode.insertBefore(btn, newCard.nextSibling);
        
        cardTitle.addEventListener('click', () => {
            cardTitle.contentEditable = 'true';
            cardTitle.focus();
          });
      
          cardTitle.addEventListener('blur', () => {
            cardTitle.contentEditable = 'false';
          });
    });
});