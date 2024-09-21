const toDoColumn = document.getElementById('to-do');
            const inProgressColumn = document.getElementById('in-progress');
            const doneColumn = document.getElementById('done');
            const draggableTask = document.getElementById('draggable-task');
            const newTaskInput = document.getElementById('new-task-input');
            const addTaskButton = document.getElementById('add-task-button');
            const newTaskInputInProgress = document.getElementById('new-task-input-in-progress');
            const addTaskButtonInProgress = document.getElementById('add-task-button-in-progress');
            const newTaskInputDone = document.getElementById('new-task-input-done');
            const addTaskButtonDone = document.getElementById('add-task-button-done');

            let draggedTask = null;
 let activeColumn = null;

            // Adiciona event listeners para arrastar e soltar
            toDoColumn.addEventListener('dragover', (event) => {
                event.preventDefault();
                activeColumn = toDoColumn;
            });

            inProgressColumn.addEventListener('dragover', (event) => {
                event.preventDefault();
                activeColumn = inProgressColumn;
            });

            doneColumn.addEventListener('dragover', (event) => {
                event.preventDefault();
                activeColumn = doneColumn;
            });

            // Event listener para iniciar o arrasto
            toDoColumn.addEventListener('dragstart', (event) => {
                if (event.target.classList.contains('task')) {
                    draggedTask = event.target;
                    draggableTask.innerHTML = draggedTask.innerHTML;
                    draggableTask.style.width = draggedTask.offsetWidth + 'px';
                    draggableTask.style.height = draggedTask.offsetHeight + 'px';
                    draggableTask.style.display = 'block';
                    draggedTask.classList.add('active');
                }
            });

            inProgressColumn.addEventListener('dragstart', (event) => {
                if (event.target.classList.contains('task')) {
                    draggedTask = event.target;
                    draggableTask.innerHTML = draggedTask.innerHTML;
                    draggableTask.style.width = draggedTask.offsetWidth + 'px';
                    draggableTask.style.height = draggedTask.offsetHeight + 'px';
                    draggableTask.style.display = 'block';
                    draggedTask.classList.add('active');
                }
            });

            doneColumn.addEventListener('dragstart', (event) => {
                if (event.target.classList.contains('task')) {
                    draggedTask = event.target;
                    draggableTask.innerHTML = draggedTask.innerHTML;
                    draggableTask.style.width = draggedTask.offsetWidth + 'px';
                    draggableTask.style.height = draggedTask.offsetHeight + 'px';
                    draggableTask.style.display = 'block';
                    draggedTask.classList.add('active');
                }
            });

            // Event listener para o arrasto
            document.addEventListener('dragover', (event) => {
                event.preventDefault();
                draggableTask.style.left = event.clientX + 'px';
                draggableTask.style.top = event.clientY + 'px';
            });

            // Event listener para soltar o arrasto
            document.addEventListener('drop', (event) => {
                event.preventDefault();
                if (activeColumn) {
                    activeColumn.appendChild(draggedTask);
                    draggedTask.classList.remove('active');
                    draggableTask.style.display = 'none';
                }
            });

            document.addEventListener('dragend', () => {
                draggedTask.classList.remove('active');
                draggableTask.style.display = 'none';
            });

            // Adicionar nova tarefa
            addTaskButton.addEventListener('click', () => {
                const taskTitle = newTaskInput.value;
                if (taskTitle) {
                    const newTask = document.createElement('div');
                    newTask.classList.add('task');
                    newTask.innerHTML = `
                        <div class="title">${taskTitle}</div>
                        <div class="tag" contenteditable="true">Tag</div>
                        <button class="edit-button">Editar</button>
                        <button class="delete-button">Excluir</button>
                    `;
                    newTask.setAttribute('draggable', 'true');

                    toDoColumn.appendChild(newTask);
                    newTaskInput.value = '';

                    // Adiciona event listeners para editar e excluir tarefas
                    newTask.addEventListener('dragstart', (event) => {
                        draggedTask = event.target;
                        draggableTask.innerHTML = draggedTask.innerHTML;
                        draggableTask.style.width = draggedTask.offsetWidth + 'px';
                        draggableTask.style.height = draggedTask.offsetHeight + 'px';
                        draggableTask.style.display = 'block';
                        draggedTask.classList.add('active');
                    });

                    newTask.querySelector('.edit-button').addEventListener('click', () => {
                        const taskTitleInput = document.createElement('input');
                        taskTitleInput.type = 'text';
                        taskTitleInput.value = newTask.querySelector('.title').textContent;
                        taskTitleInput.style.width = '100%';

                        const saveButton = document.createElement('button');
                        saveButton.textContent = 'Salvar';
                        saveButton.addEventListener('click', () => {
                            newTask.querySelector('.title').textContent = taskTitleInput.value;
                            newTask.removeChild(taskTitleInput);
                            newTask.removeChild(saveButton);
                        });

                        newTask.querySelector('.title').textContent = '';
                        newTask.appendChild(taskTitleInput);
                        newTask.appendChild(saveButton);
                    });

                    newTask.querySelector('.delete-button').addEventListener('click', () => {
                        toDoColumn.removeChild(newTask);
                    });
                }
            });

            addTaskButtonInProgress.addEventListener('click', () => {
                const taskTitle = newTaskInputInProgress.value;
                if (taskTitle) {
                    const newTask = document.createElement('div');
                    newTask.classList.add('task');
                    newTask.innerHTML = `
                        <div class="title">${taskTitle}</div>
                        <div class="tag" contenteditable="true"> Tag</div>
                        <button class="edit-button">Editar</button>
                        <button class="delete-button">Excluir</button>
                    `;
                    newTask.setAttribute('draggable', 'true');

                    inProgressColumn.appendChild(newTask);
                    newTaskInputInProgress.value = '';

                    // Adiciona event listeners para editar e excluir tarefas
                    newTask.addEventListener('dragstart', (event) => {
                        draggedTask = event.target;
                        draggableTask.innerHTML = draggedTask.innerHTML;
                        draggableTask.style.width = draggedTask.offsetWidth + 'px';
                        draggableTask.style.height = draggedTask.offsetHeight + 'px';
                        draggableTask.style.display = 'block';
                        draggedTask.classList.add('active');
                    });

                    newTask.querySelector('.edit-button').addEventListener('click', () => {
                        const taskTitleInput = document.createElement('input');
                        taskTitleInput.type = 'text';
                        taskTitleInput.value = newTask.querySelector('.title').textContent;
                        taskTitleInput.style.width = '100%';

                        const saveButton = document.createElement('button');
                        saveButton.textContent = 'Salvar';
                        saveButton.addEventListener('click', () => {
                            newTask.querySelector('.title').textContent = taskTitleInput.value;
                            newTask.removeChild(taskTitleInput);
                            newTask.removeChild(saveButton);
                        });

                        newTask.querySelector('.title').textContent = '';
                        newTask.appendChild(taskTitleInput);
                        newTask.appendChild(saveButton);
                    });

                    newTask.querySelector('.delete-button').addEventListener('click', () => {
                        inProgressColumn.removeChild(newTask);
                    });
                }
            });

            addTaskButtonDone.addEventListener('click', () => {
                const taskTitle = newTaskInputDone.value;
                if (taskTitle) {
                    const newTask = document.createElement('div');
                    newTask.classList.add('task');
                    newTask.innerHTML = `
                        <div class="title">${taskTitle}</div>
                        <div class="tag" contenteditable="true">Tag</div>
                        <button class="edit-button">Editar</button>
                        <button class="delete-button">Excluir</button>
                    `;
                    newTask.setAttribute('draggable', 'true');

                    doneColumn.appendChild(newTask);
                    newTaskInputDone.value = '';

                    // Adiciona event listeners para editar e excluir tarefas
                    newTask.addEventListener('dragstart', (event) => {
                        draggedTask = event.target;
                        draggableTask.innerHTML = draggedTask.innerHTML;
                        draggableTask.style.width = draggedTask.offsetWidth + 'px';
                        draggableTask.style.height = draggedTask.offsetHeight + 'px';
                        draggableTask .style.display = 'block';
                        draggedTask.classList.add('active');
                    });

                    newTask.querySelector('.edit-button').addEventListener('click', () => {
                        const taskTitleInput = document.createElement('input');
                        taskTitleInput.type = 'text';
                        taskTitleInput.value = newTask.querySelector('.title').textContent;
                        taskTitleInput.style.width = '100%';

                        const saveButton = document.createElement('button');
                        saveButton.textContent = 'Salvar';
                        saveButton.addEventListener('click', () => {
                            newTask.querySelector('.title').textContent = taskTitleInput.value;
                            newTask.removeChild(taskTitleInput);
                            newTask.removeChild(saveButton);
                        });

                        newTask.querySelector('.title').textContent = '';
                        newTask.appendChild(taskTitleInput);
                        newTask.appendChild(saveButton);
                    });

                    newTask.querySelector('.delete-button').addEventListener('click', () => {
                        doneColumn.removeChild(newTask);
                    });
                }
            });