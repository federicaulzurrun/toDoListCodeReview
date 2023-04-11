const formTodo = document.getElementById('list-form');
const containerTask = document.getElementById('toDo-list');
const newToDo = document.getElementById('imput-task');
let toDos = [];

// rendering the toDo list
const renderToDo = () => {
  const toDos = JSON.parse(localStorage.getItem('todos')) || [];
  containerTask.innerHTML = '';
  toDos.sort((a, b) => a.index - b.index);
  containerTask.innerHTML = '';
  for (let i = 0; i < toDos.length; i += 1) {
    const checked = toDos[i].completed ? 'checked' : '';
    const strike = toDos[i].completed ? 'strike-through' : '';
    const html = `
      <div class="task">
        <input type="checkbox" class="checkbox-input" ${checked}>
        <input type="text" class="text-input ${strike}" value="${toDos[i].value}" data-id="${toDos[i].id}">
        <i class="delete-task-icon fa-solid fa-trash"></i>
      </div>
    `;
    containerTask.innerHTML += html;
  }
};

const updateLocalStorage = (tasksArray) => {
  localStorage.setItem('todos', JSON.stringify(tasksArray));
}

const edit = (index) => {
  const tasksArray = JSON.parse(localStorage.getItem('todos')) || [];
  const textInputs = document.querySelectorAll('.text-input');
  textInputs[index].addEventListener('change', () => {
    tasksArray[index].value = textInputs[index].value;
    updateLocalStorage(tasksArray);
  });
};


class TODOLIST {
  strikeThrough(id) {
    this.toDos = JSON.parse(localStorage.getItem('todos')) || [];
    const checkBoxes = document.querySelectorAll('.checkbox-input');
    if (checkBoxes[id].checked) {
      this.toDos[id].completed = true;
      localStorage.setItem('todos', JSON.stringify(this.toDos));
      renderToDo();
    } else {
      this.toDos[id].completed = false;
      localStorage.setItem('todos', JSON.stringify(this.toDos));
    }
  }
}

const clearAll = () => {
  const toDos = JSON.parse(localStorage.getItem('todos')) || [];
  for (let i = 0; i < toDos.length; i += 1) {
    if (toDos[i].completed) {
      toDos.splice(i, 1);
      i -= 1;
    }
  }
  for (let i = 1; i <= toDos.length; i += 1) {
    toDos[i - 1].id = i;
  }
  localStorage.setItem('todos', JSON.stringify(toDos));
};

// function add taks
const addTask = () => {
  const toDoValue = newToDo.value;
  const emptyToDo = toDoValue === '';

  if (emptyToDo) return;

  const task = {
    value: toDoValue,
    completed: false,
    id: toDos.length + 1,
  };

  newToDo.value = '';
  toDos.push(task);
  localStorage.setItem('todos', JSON.stringify(toDos));
  renderToDo(); // we call the renderToDo function to display the new element on the screen
};

const submitIcon = document.getElementById('submit-icon');
submitIcon.addEventListener('click', addTask);

// form submit
formTodo.addEventListener('submit', (event) => {
  event.preventDefault();

  addTask();
  renderToDo();
  localStorage.setItem('todos', JSON.stringify(toDos));
});

// delete task
containerTask.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-task-icon')) {
    const taskElement = event.target.parentNode;
    const taskId = parseInt(taskElement.querySelector('.text-input').getAttribute('data-id'), 10);
    const taskIndex = toDos.findIndex((task) => task.id === taskId);
    toDos.splice(taskIndex, 1);
    taskElement.remove();

    // update the id of the remaining tasks
    for (let i = taskIndex; i < toDos.length; i += 1) {
      toDos[i].id = i + 1;
    }

    localStorage.setItem('todos', JSON.stringify(toDos));
  }
});

// clear all checked button
const todo = new TODOLIST();
containerTask.addEventListener('click', (event) => {
  const checkBox = event.target.closest('.checkbox-input');
  if (checkBox) {
    const checkBoxes = containerTask.querySelectorAll('.checkbox-input');
    const id = Array.from(checkBoxes).indexOf(checkBox);
    todo.strikeThrough(id);
    renderToDo();
  }
});

const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', () => {
  clearAll();
  renderToDo();
});

// edit task
containerTask.addEventListener('click', (event) => {
  const textInput = event.target.closest('.text-input');
  if (textInput) {
    const textInputs = containerTask.querySelectorAll('.text-input');
    const index = Array.from(textInputs).indexOf(textInput);
    edit(index);
  }
});

window.addEventListener('load', () => {
  const storedToDos = JSON.parse(localStorage.getItem('todos'));
  if (storedToDos) {
    toDos = storedToDos;
    renderToDo();
  }
});