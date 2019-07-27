//Globals
var makeTaskButton = document.getElementById('make-task-button');
var clearButton = document.getElementById('clear-button');
var aside = document.getElementById('aside');

//On Load
disableButton(makeTaskButton);
disabledButton(makeTaskButton);
disableButton(clearButton);
disabledButton(clearButton);

//Event Handlers
aside.addEventListener('click', asideHandler);
aside.addEventListener('keyup', asideKeyupHandler);

//Functions
function asideHandler(event) {
  event.preventDefault();
  addTaskHandler(event);
  makeTaskListEventHandler(event);
  deleteTaskHandler(event);
  clearButtonHandler(event);
}

function asideKeyupHandler(event) {
  event.preventDefault();
  keyupMakeListButtonHandler(event);
  clearDisabledHandler();
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
    title.placeholder = 'Add a title';
  }
}

function keyupMakeListButtonHandler(event) {
  if(event.target.id === 'form--task-title-input'){
    var titleInput = document.getElementById('form--task-title-input');
    var tasksUl = document.getElementById('form--appended-tasks');
    makeTaskListButtonHandler(titleInput, tasksUl);
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

function clearButtonHandler(event) {
  if(event.target.id === 'clear-button') {
    var titleInput = document.getElementById('form--task-title-input');
    var taskInput = document.getElementById('section--add-task-input');
    clearFields([titleInput, taskInput]);
    removeListItems();
    disableButton(makeTaskButton);
    disabledButton(makeTaskButton);
    disableButton(clearButton);
    disabledButton(clearButton);
  }
}

function removeListItems() {
  liTasks = document.querySelectorAll('.task');
  liTasks.forEach(task => task.remove());
}

function clearDisabledHandler(){
  var titleInputValue = document.getElementById('form--task-title-input').value;
  var taskInputValue = document.getElementById('section--add-task-input').value;
  var tasksUlChildCount = document.getElementById('form--appended-tasks').childElementCount;

  if(titleInputValue === '' && taskInputValue === '' && tasksUlChildCount === 0) {
    disableButton(clearButton);
    disabledButton(clearButton);
  } else {
    enableButton(clearButton);
    enabledButton(clearButton);
  }
}

function clearFields(fieldsArray) {
  fieldsArray.forEach(element => element.value = '');
}