// Seleciona todas as divs com a classe column
const columns = document.querySelectorAll('.column');

// Adiciona eventos de dragover e drop às divs column
columns.forEach((column) => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    const card = document.querySelector('.card[draggable="true"]');
    column.appendChild(card);
  });
});

// Adiciona evento de dragstart à div card
const card = document.querySelector('.card[draggable="true"]');
card.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text', e.target.id);
});