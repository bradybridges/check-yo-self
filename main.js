//Globals
var makeTaskButton = document.getElementById('make-task-button');
var clearButton = document.getElementById('clear-button');
var aside = document.getElementById('aside');
var main = document.getElementById('main');
var toDoArray = [];

//On Load
rebuildFromLocal();
noToDoHandler();
disableButton(makeTaskButton);
disabledButton(makeTaskButton);
disableButton(clearButton);
disabledButton(clearButton);
onLoadUrgentStylesHandler();
onLoadCompletedTasks();

//Event Handlers
aside.addEventListener('click', asideClickHandler);
aside.addEventListener('keyup', asideKeyupHandler);
main.addEventListener('click', mainClickHandler);

//Functions--Primary Handlers
function asideClickHandler(event) {
  event.preventDefault();
  addTaskHandler(event);
  makeTaskListEventHandler(event);
  deleteTaskHandler(event);
  clearButtonHandler(event);
  addTaskListHandler(event);
}

function asideKeyupHandler(event) {
  event.preventDefault();
  keyupMakeListButtonHandler(event);
  clearDisabledHandler();
}

function mainClickHandler(event) {
  event.preventDefault();
  toggleUrgentHandler(event);
  checkOffTaskHandler(event);
  deleteButtonToggle(event);
}
//Functions
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

function disableButton(button) {
  button.disabled = true;
}

function enableButton(button) {
  button.disabled = false;
  button.style.cursor = 'pointer';
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
    <li class="task"><div class="delete-task">x</div><span class="task-content">${task}</span></li>
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
    clearTaskForm();
  }
}

function clearTaskForm() {
  var titleInput = document.getElementById('form--task-title-input');
  var taskInput = document.getElementById('section--add-task-input');
  clearFields([titleInput, taskInput]);
  removeListItems();
  disableButton(makeTaskButton);
  disabledButton(makeTaskButton);
  disableButton(clearButton);
  disabledButton(clearButton);
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

function addTaskListHandler(event) {
  if(event.target.id === 'make-task-button') {
    toDoCreationHandler();
    clearTaskForm();
  }
}

function toDoCreationHandler() {
  var title = document.getElementById('form--task-title-input').value;
  var tasksStrings = grabTasks();
  var tasks = [];

  tasksStrings.forEach(taskString => tasks.push(new Task(taskString)));

  toDoObj = {
    id: Date.now(),
    title: title,
    tasks: tasks,
    urgent: false,
  }

  createSaveToDo(toDoObj);
  appendToDo(toDoObj);
  noToDoHandler();
}

function grabTasks() {
  var tasksArray = [];
  var tasks = document.querySelectorAll('.task-content');

  tasks.forEach(task => tasksArray.push(task.innerText));
  return tasksArray;
}

function createSaveToDo(toDoObj) {
  var toDoList = new ToDoList(toDoObj);
  toDoArray = toDoList.saveToStorage(toDoArray);
}

function clearFields(fieldsArray) {
  fieldsArray.forEach(element => element.value = '');
}

function rebuildFromLocal() {
  rebuildGlobalToDo();
  rebuildCards(toDoArray);
}

function rebuildGlobalToDo() {
  var tempToDoArray = JSON.parse(localStorage.getItem('toDoArray'));

  if(tempToDoArray === null) {
    return;
  }

  for(var i = 0; i < tempToDoArray.length; i++) {
    var tasks = [];
    tempToDoArray[i].tasks.forEach(task => tasks.push(new Task(task)));
    var tempToDoObj = {
      id: tempToDoArray[i].id,
      title: tempToDoArray[i].title,
      tasks: tasks,
      urgent: tempToDoArray[i].urgent,
    }
    toDoArray.push(new ToDoList(tempToDoObj));
  }
}

function rebuildCards(toDoArray) {
  toDoArray.forEach(toDoObj => appendToDo(toDoObj));
}

function appendToDo(toDoObj) {
  var urgentSrc = determineUrgentSrcAndAlt(toDoObj);
  var tasksLi = createTasksToAppend(toDoObj);
  main.insertAdjacentHTML('afterbegin',`
    <section data-id="${toDoObj.id}"class="main--to-do">
      <article class="section--to-do-header">
      ${toDoObj.title}
      </article>
      <article class="section--to-do-body">
        <ul class="article--to-do-ul">
          ${tasksLi}
        </ul>
      </article>
      <article class="section--to-do-footer">
        <div class="article--footer-button article--urgent-div">
          <img class="div--footer-img div--urgent-img" ${urgentSrc}>
          <p class="div--footer-text" data-urgent="${toDoObj.urgent}">URGENT</p>
        </div>
        <div class="article--footer-button article--delete-div">
          <img class="div--footer-img" src="images/delete.svg" alt="delete button inactive">
          <p class="div--footer-text">DELETE</p>
        </div>
      </article>
    </section>`);
}

function createTasksToAppend(toDoObj) {
  var tasks = '';
  var taskIndex = -1;

  for(var i = 0; i < toDoObj.tasks.length; i++) {
    taskIndex++;
    var complete = toDoObj.tasks[i].complete;
    var checkmarkSrc = determineCheckSrc(complete);
    tasks += `<li class="ul--task" data-index=${taskIndex} data-complete="${complete}"><img class="li--checkbox-img" src="${checkmarkSrc}" alt="checkbox inactive">${toDoObj.tasks[i].task}</li>`;
  }

  return tasks;
}

function determineUrgentSrcAndAlt(toDoObj) {
  if(toDoObj.urgent === false) {
    return "src=\"images/urgent.svg\" alt=\"urgent icon inactive\"";
  } else {
    return "src=\"images/urgent-active.svg\" alt=\"urgent icon active\"";
  }
}

function determineCheckSrc(completed) {
  if(completed === true) {
    return 'images/checkbox-active.svg';
  } else {
    return 'images/checkbox.svg';
  }
}

function noToDoHandler() {
  var noToDoMessage = document.getElementById('main--no-to-do');
  if(main.childElementCount === 0) {
    displayNoToDoMessage();
  } else if(noToDoMessage !== null){
    removeNoToDoMessage();
  }
}

function displayNoToDoMessage() {
  main.insertAdjacentHTML('afterbegin',`
    <h2 id="main--no-to-do">No To Do Lists:/</h1>`)
}

function removeNoToDoMessage() {
  var noToDoMessage = document.getElementById('main--no-to-do');
  noToDoMessage.remove();
}

function toggleUrgentHandler(event) {
  if(event.target.classList.contains('div--urgent-img')) {
    toggleUrgent(event);
  }
}

function toggleUrgent(event) {
  var currentId = event.target.parentNode.parentNode.parentNode.dataset.id;

  if(event.target.src.indexOf('urgent.svg') >= 0){
    event.target.src = 'images/urgent-active.svg';
    urgentCardStyles(event, true);
    updateUrgent(currentId, true);
  } else {
    event.target.src = 'images/urgent.svg';
    urgentCardStyles(event, false);
    updateUrgent(currentId, false);
  }
}

function toggleUrgentTextDataset(event) {
  var urgentText = event.target.parentNode.children[1];

  if(urgentText.dataset.urgent === 'true') {
    urgentText.dataset.urgent = 'false';
  } else {
    urgentText.dataset.urgent = 'true';
  }
}

function urgentCardStyles(event, isUrgent){
  var currentCard = event.target.parentNode.parentNode.parentNode;
  if(isUrgent === true){
  currentCard.style.backgroundColor = '#ffe89d';
  toggleUrgentTextDataset(event);
  toggleUrgentText(event);
  } else {
    currentCard.style.backgroundColor = '#fafdff';
    toggleUrgentTextDataset(event);
    toggleUrgentText(event);
  }
}

function toggleUrgentText(event) {
  urgentText = event.target.parentNode.children[1];

  if(urgentText.dataset.urgent === 'false'){
    urgentText.style.color = '#1f1f3d';
  } else {
    urgentText.style.color = '#b23a25';
  }
}

function updateUrgent(currentId, urgentBoolean) {
  var index = findToDo(currentId);
  var tempToDo = toDoArray[index];
  tempToDo.urgent = urgentBoolean;
  toDoArray[index].updateToDo(tempToDo);
  toDoArray[index].saveUpdatedToLocal(toDoArray);
}

function findToDo(toDoId) {
  var index = -1;
  toDoId = Number(toDoId);
  for(var i = 0; i < toDoArray.length; i++) {
    if(toDoArray[i].id === toDoId) {
      index = i;
    }
  }
  return index;
}

function onLoadUrgentStylesHandler() {
  onLoadUrgentBackground();
  onLoadUrgentText();
}

function onLoadUrgentBackground() {
  var domToDos = document.querySelectorAll('.main--to-do');

  for(var i = 0; i < domToDos.length; i++) {
    if(domToDos[i].children[2].children[0].children[0].src.includes('urgent-active.svg')){
      domToDos[i].style.backgroundColor = '#ffe89d';
    }
  }
}

function onLoadUrgentText() {
  var urgentTexts = document.querySelectorAll('.div--footer-text');

  for(var i = 0; i < urgentTexts.length; i++) {
    if(urgentTexts[i].dataset.urgent === 'true') {
      urgentTexts[i].style.color = '#b23a25';
    } else {
      urgentTexts[i].style.color = '#1f1f3d';
    }
  }
}

function checkOffTaskHandler(event) {
  if(event.target.classList.contains('li--checkbox-img')){
    checkBoxToggle(event);
    updateCompleted(event);
    toggleCompletedDataset(event);
  }
}

function checkBoxToggle(event) {
  if(event.target.src.includes('checkbox.svg')) {
    event.target.src = 'images/checkbox-active.svg';
    completedStylesToggle(event, true);

  } else {
    event.target.src = 'images/checkbox.svg';
    completedStylesToggle(event, false);
  }
}

function completedStylesToggle(event, onOrOffBool) {
  var checkBoxParentLi = event.target.parentNode;
  
  if(onOrOffBool) {
    checkBoxParentLi.style.textDecoration = 'line-through';
    checkBoxParentLi.style.color = '#3c6577';
  } else {
    checkBoxParentLi.style.textDecoration = 'none';
    checkBoxParentLi.style.color = '#1f1f3d';
  }
}

function toggleCompletedDataset(event) {
  var completeStatus = event.target.parentNode.dataset.complete;

  if(completeStatus === 'true') {
    event.target.parentNode.dataset.complete = 'false';
  } else {
    event.target.parentNode.dataset.complete = 'true';
  }
}

function updateCompleted(event) {
  var currentCardId = event.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
  var taskIndex = event.target.parentNode.dataset.index;
  var cardIndex = findToDo(currentCardId);
  toDoArray[cardIndex].tasks[taskIndex].toggleComplete();
  toDoArray[cardIndex].saveUpdatedToLocal(toDoArray);
}

function onLoadCompletedTasks() {
  domToDos = document.querySelectorAll('.ul--task');
  
  for(var i = 0; i < domToDos.length; i++) {
    if(domToDos[i].dataset.complete === 'true') {
      domToDos[i].style.color = '#3c6577';
      domToDos[i].style.textDecoration = 'line-through';
    }
  }
}

function deleteButtonToggle(event) {
  if(event.target.classList.contains('li--checkbox-img') && checkCompletion(event)) {
    enableDelete(event);
  } else {
    disableDelete(event);
  }
}

function checkCompletion(event) {
  var incompleteCount = 0;
  var tasks = event.target.parentNode.parentNode.children;
  
  for(var i = 0; i < tasks.length; i++) {
    if(tasks[i].dataset.complete === 'false') {
      incompleteCount++;
    }
  }

  if(incompleteCount > 0) {
    return false;
  } else {
    return true;
  }
}

function enableDelete(event) {
  var deleteButton = event.target.parentNode.parentNode.parentNode.parentNode.children[2].children[1].children[0];
  var deleteText = event.target.parentNode.parentNode.parentNode.parentNode.children[2].children[1].children[1];
  deleteButton.src = 'images/delete-active.svg';
  deleteText.style.color = '#b23a25';
}

function disableDelete(event) {
  var deleteButton = event.target.parentNode.parentNode.parentNode.parentNode.children[2].children[1].children[0];
  var deleteText = event.target.parentNode.parentNode.parentNode.parentNode.children[2].children[1].children[1];
  deleteButton.src = 'images/delete.svg';
  deleteText.style.color = '#1f1f3d';
}