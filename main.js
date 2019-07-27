//Globals
var makeTaskButton = document.getElementById('make-task-button');
var aside = document.getElementById('aside');

//On Load
disableButton(makeTaskButton);
disabledButton(makeTaskButton);

//Event Handlers
aside.addEventListener('click', asideHandler);

//Functions
function asideHandler(event) {
  event.preventDefault();
  addTaskHandler(event);
  makeTaskListEventHandler(event);
  deleteTaskHandler(event);
  
}

function makeTaskListEventHandler(event) {
  if(event.target.id === 'section--add-task-button') {
    var titleInput = document.getElementById('form--task-title-input');
    var tasksUl = document.getElementById('form--appended-tasks');
    makeTaskListButtonHandler(titleInput, tasksUl);
  }
}

function makeTaskListButtonHandler(title, tasksUl) {

  if((title.value === '') || (tasksUl.childElementCount === 0)) {
    disableButton(makeTaskButton);
    disabledButton(makeTaskButton);
  } else {
    enableButton(makeTaskButton);
    enabledButton(makeTaskButton);
  }

  if(title.value === ''){
    title.placeholder = 'Add a title click +';
  }
}

function disableButton(input) {
  input.disabled = true;
}

function enableButton(input) {
  input.disabled = false;
}

function disabledButton(button) {
  button.style.backgroundColor = "#ccc";
  button.style.cursor = 'default';
}

function enabledButton(button) {
  button.style.backgroundColor = '#1f1f3d';
}

function addTaskHandler(event) {
  if(event.target.id === 'section--add-task-button'){
    addTask(event);
  }
}

function addTask(event) {
  if(checkTaskItem()) {
    var task = document.getElementById('section--add-task-input');
    insertTask(task.value);
    clearFields([task]);
  } 
}

function insertTask(task){
  var taskUl = document.getElementById('form--appended-tasks');
  taskUl.insertAdjacentHTML('beforeend', `
    <li class="task"><div class="delete-task">x</div>${task}
    `);
}

function checkTaskItem() {
  var taskInput = document.getElementById('section--add-task-input');
  if(taskInput.value !== '') {
    return true;
  } else {
    return false;
  }
}

function deleteTaskHandler(event) {
  if(event.target.classList.contains('delete-task')){
    var liItem = event.target.parentNode;
    deleteTask(liItem);
  }
  var taskUl = document.getElementById('form--appended-tasks');

  if(taskUl.childElementCount === 0){
    disableButton(makeTaskButton);
    disabledButton(makeTaskButton);
  }
}

function deleteTask(listItem) {
  listItem.remove();
}

function clearFields(fieldsArray) {
  fieldsArray.forEach(element => element.value = '');
}