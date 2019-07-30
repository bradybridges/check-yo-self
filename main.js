//Globals
var makeTaskButton = document.getElementById('make-task-button');
var clearButton = document.getElementById('clear-button');
var main = document.getElementById('header');
var aside = document.getElementById('aside');
var main = document.getElementById('main');
var toDoArray = [];

//On Load
rebuildFromLocal();
noToDoHandler();
disableButton(makeTaskButton);
disableButton(clearButton);
onLoadUrgentStylesHandler();
onLoadCompletedTasks();
onLoadDeleteStyles();
onLoadUrgentBorders();

//Event Handlers
header.addEventListener('keyup', headerKeyupHandler);
aside.addEventListener('click', asideClickHandler);
aside.addEventListener('keyup', asideKeyupHandler);
main.addEventListener('click', mainClickHandler);
main.addEventListener('focusout', updateContentHandler);

//Functions
function asideClickHandler(event) {
  event.preventDefault();
  addTaskHandler(event);
  makeTaskListEventHandler(event);
  deleteTaskHandler(event);
  clearButtonHandler(event);
  addTaskListHandler(event);
  filterByUrgentHandler(event);
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
  deleteToDo(event);
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
  } else {
    enableButton(makeTaskButton);
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
  button.style.backgroundColor = "#ccc";
  button.style.cursor = 'default';
}

// function enableButton(button) {
//   button.disabled = false;
//   button.style.cursor = 'pointer';
// }

// function disabledButton(button) {
//   button.style.backgroundColor = "#ccc";
//   button.style.cursor = 'default';
// }

function enableButton(button) {
  button.disabled = false;
  button.style.backgroundColor = '#1f1f3d';
  button.style.cursor = 'pointer';
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
    <li class="task"><div class="delete-task">&#10005;</div><span class="task-content">${task}</span></li>
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
    clearDisabledHandler();
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
  disableButton(clearButton);
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
  } else {
    enableButton(clearButton);
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
  tasksStrings.forEach(taskString => tasks.push(new Task({task: taskString, complete: false,})));

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
  var isUrgent = determineUrgentStatus(toDoObj);
  var tasksLi = createTasksToAppend(toDoObj);
  main.insertAdjacentHTML('afterbegin',`
    <section class="main--to-do" data-id="${toDoObj.id}" data-urgent="${isUrgent}">
      <article class="section--to-do-header" contenteditable="true">
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
    tasks += `<li class="ul--task" data-index=${taskIndex} data-complete="${complete}"><img class="li--checkbox-img" src="${checkmarkSrc}" alt="checkbox inactive"><span class="li--task-span"contenteditable="true">${toDoObj.tasks[i].task}</span></li>`;
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

function determineUrgentStatus(toDoObj) {
  if(toDoObj.urgent === false) {
    return false;
  } else {
    return true;
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
    event.target.parentNode.parentNode.parentNode.dataset.urgent = 'true';
  } else {
    event.target.src = 'images/urgent.svg';
    urgentCardStyles(event, false);
    updateUrgent(currentId, false);
    event.target.parentNode.parentNode.parentNode.dataset.urgent = 'false';
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
    toggleUrgentBorders(event);
  } else {
    currentCard.style.backgroundColor = '#fafdff';
    toggleUrgentTextDataset(event);
    toggleUrgentText(event);
    toggleUrgentBorders(event);
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

function toggleUrgentBorders(event) {
  var currentCard = event.target.closest('.main--to-do');
  var isUrgent = currentCard.dataset.urgent;
  var cardHeader = currentCard.children[0];
  var cardBody = currentCard.children[1];
  
  if(isUrgent === 'false') {
    displayUrgentBorders(currentCard, cardHeader, cardBody);
  } else {
    undoUrgentBorders(currentCard, cardHeader, cardBody);
  }
}

function displayUrgentBorders(currentCard, cardHeader, cardBody) {
  currentCard.style.border = 'solid #ffc30c 2px';
  cardHeader.style.borderBottom = 'solid #ffc30c 2px';
  cardBody.style.borderBottom = 'solid #ffc30c 2px';
}

function undoUrgentBorders(currentCard, cardHeader, cardBody) {
  currentCard.style.border = 'solid #c7d3d8 2px';
  cardHeader.style.borderBottom = 'solid #c7d3d8 2px';
  cardBody.style.borderBottom = 'solid #c7d3d8 2px';
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

function onLoadUrgentBorders() {
  var domToDos = document.querySelectorAll('.main--to-do');
  domToDos = Array.from(domToDos);

  for(var i = 0; i < domToDos.length; i++){
    if(domToDos[i].dataset.urgent === 'true') {
      var cardHeader = domToDos[i].children[0];
      var cardBody = domToDos[i].children[1];
      domToDos[i].style.border = 'solid #ffc30c 2px';
      cardHeader.style.borderBottom = 'solid #ffc30c 2px';
      cardBody.style.borderBottom = 'solid #ffc30c 2px';
    }
  }
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
    checkBoxParentLi.style.fontStyle = 'italic';
  } else {
    checkBoxParentLi.style.textDecoration = 'none';
    checkBoxParentLi.style.color = '#1f1f3d';
    checkBoxParentLi.style.fontStyle = 'normal';
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
      domToDos[i].style.fontStyle = 'italic';
    }
  }
}

function deleteButtonToggle(event) {
  if(event.target.classList.contains('li--checkbox-img') && checkCompletion(event)) {
    enableDelete(event);
  } else if(event.target.classList.contains('li--checkbox-img')) {
    disableDelete(event);
  }
}

function checkCompletion(event) {
  var incompleteCount = 0;
  var tasks = event.target.closest('.main--to-do').children[1].children[0].children;
  
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

function deleteToDo(event) {

  if((event.target.classList.contains('article--delete-div') || event.target.parentNode.classList.contains('article--delete-div')) && checkCompletion(event)) {
    var currentCard = event.target.closest('.main--to-do');
    var currentCardIndex = event.target.closest('.main--to-do').dataset.id;
    currentCardIndex = findToDo(currentCardIndex);
    toDoArray = toDoArray[currentCardIndex].deleteFromStorage(toDoArray);
    currentCard.remove();
    noToDoHandler();
  }
}

function onLoadDeleteStyles() {
  var domToDos = document.querySelectorAll('.main--to-do');
  domToDos.forEach(toDoCard => detectDeleteEligibility(toDoCard));
}

function detectDeleteEligibility(toDoCard) {
  var tasks = toDoCard.children[1].children[0].children;
  var deleteImg = toDoCard.children[2].children[1].children[0];
  var deleteText = toDoCard.children[2].children[1].children[1];
  var incompleteCount = 0 ;

  for(var i = 0; i < tasks.length; i++) {
    if(tasks[i].dataset.complete === 'false') {
      incompleteCount++
    }
  }

  if(incompleteCount === 0) {
    deleteImg.src = 'images/delete-active.svg';
    deleteText.style.color = '#b23a25';
  }

}

function headerKeyupHandler(event) {
  event.preventDefault();
  if(event.target.id === 'form--search-input') {
    searchTitles(event);
  }
}

function searchTitles(event) {
  var searchValue = event.target.value;
  var filterBy = document.getElementById('select-search-dropdown').value;

  if(filterBy === 'title'){
    searchDisplayHandler(searchValue);
  }

  if(filterBy === 'task') {
    taskSearchHandler(searchValue);
  }

  if(filterBy === 'all') {
    allSearchHandler(searchValue);
  }
}

function searchDisplayHandler(searchValue) {
  var filterByUrgentStatus = document.getElementById('filter-by-urgent-button');
   filterByUrgentStatus = filterByUrgentStatus.dataset.status;
  
  if(filterByUrgentStatus === 'off') {
    titleSearchHandler(searchValue);
  } else {
    urgentTitleSearchHandler(searchValue);
  }
}

function titleSearchHandler(searchValue) {
  var domToDos = document.querySelectorAll('.main--to-do');
  searchValue = searchValue.toUpperCase();
  domToDos = Array.from(domToDos);
  var cardsToRemove = domToDos.filter(card => card.children[0].innerText.toUpperCase().includes(searchValue) === false);
  cardsToRemove.forEach(card => card.style.display = 'none');
  var cardsToAdd = domToDos.filter(card => card.children[0].innerText.toUpperCase().includes(searchValue) === true);
  cardsToAdd.forEach(card => card.style.display = 'block');
}

function urgentTitleSearchHandler(searchValue) {
  var urgentDomToDos = document.querySelectorAll('.main--to-do');
  urgentDomToDos = Array.from(urgentDomToDos).filter(card => card.dataset.urgent === 'true');
  searchValue = searchValue.toUpperCase();
  var cardsToRemove = urgentDomToDos.filter(card => card.children[0].innerText.toUpperCase().includes(searchValue) === false);
  cardsToRemove.forEach(card => card.style.display = 'none');
  var cardsToAdd = urgentDomToDos.filter(card => card.children[0].innerText.toUpperCase().includes(searchValue) === true);
  cardsToAdd.forEach(card => card.style.display = 'block');
}

function taskSearchHandler(searchValue) {
  var filterByUrgentStatus = document.getElementById('filter-by-urgent-button');
   filterByUrgentStatus = filterByUrgentStatus.dataset.status;

   if(filterByUrgentStatus === 'off') {
    allTaskSearch(searchValue);
   } else {
    urgentTaskSearch(searchValue);
   }
  // var domToDos = document.querySelectorAll('.main--to-do');
  // searchValue = searchValue.toUpperCase();
  // domToDos = Array.from(domToDos);

  // for(var i = 0; i < domToDos.length; i++) {
  //   var tasks = domToDos[i].children[1].children[0].children;
  //   if(containsTask(tasks, searchValue)) {
  //     domToDos[i].style.display = 'block';
  //   } else {
  //     domToDos[i].style.display = 'none';
  //   }
  // }
}

function allTaskSearch(searchValue) {
  var domToDos = document.querySelectorAll('.main--to-do');
  searchValue = searchValue.toUpperCase();
  domToDos = Array.from(domToDos);

  for(var i = 0; i < domToDos.length; i++) {
    var tasks = domToDos[i].children[1].children[0].children;
    if(containsTask(tasks, searchValue)) {
      domToDos[i].style.display = 'block';
    } else {
      domToDos[i].style.display = 'none';
    }
  }
}

function urgentTaskSearch(searchValue) {
  var domToDos = document.querySelectorAll('.main--to-do');
  searchValue = searchValue.toUpperCase();
  domToDos = Array.from(domToDos);
  urgentDomToDos = domToDos.filter(card => card.dataset.urgent === 'true');

  for(var i = 0; i < urgentDomToDos.length; i++) {
    var tasks = urgentDomToDos[i].children[1].children[0].children;
    if(containsTask(tasks, searchValue)) {
      urgentDomToDos[i].style.display = 'block';
    } else {
      urgentDomToDos[i].style.display = 'none';
    }
  }
}

function allSearchHandler(searchValue) {
  var domToDos = document.querySelectorAll('.main--to-do');
  turnOffFilterByUrgent();
  searchValue = searchValue.toUpperCase();
  domToDos = Array.from(domToDos);
  determineMatchingTitleOrTasks(domToDos, searchValue);
}

function turnOffFilterByUrgent() {
  var urgentButton = document.getElementById('filter-by-urgent-button');
  var domToDos = document.querySelectorAll('.main-to-do');
  urgentButton.dataset.status = 'off';
  urgentButton.style.backgroundColor = '#1f1f3d';
  domToDos.forEach(card => card.style.display = 'block');
}

function determineMatchingTitleOrTasks(domToDos, searchValue) {
  for(var i = 0; i < domToDos.length; i++) {
    var tasks = domToDos[i].children[1].children[0].children;
    if(domToDos[i].children[0].innerText.toUpperCase().includes(searchValue)) {
      domToDos[i].style.display = 'block';
    } else if(containsTask(tasks, searchValue)){
      domToDos[i].style.display = 'block';
    } else {
      domToDos[i].style.display = 'none';
    }
  }
}

function containsTask(tasks, searchValue) {
  var searchSuccess = false;
  // debugger;
  for(var i = 0; i < tasks.length; i++) {
    if(tasks[i].innerText.toUpperCase().includes(searchValue)) {
      searchSuccess = true;
    }
  }

  return searchSuccess;
}

function filterByUrgentHandler(event) {
  var noToDoMessage = document.getElementById('main--no-to-do');
  
  if(event.target.id === 'filter-by-urgent-button' && noToDoMessage === null) {
    toggleFilterButtonActive(event);
    filterByUrgent(event);
    toggleNoUrgentMessage();
  }
}

function toggleFilterButtonActive(event) {
  if(event.target.dataset.status === 'off') {
    event.target.dataset.status = 'on';
    event.target.style.backgroundColor = '#ef4a23';
  } else {
    event.target.dataset.status = 'off';
    event.target.style.backgroundColor = '#1f1f3d';
  }
}

function filterByUrgent(event) {
  var domToDos = document.querySelectorAll('.main--to-do');
  domToDos = Array.from(domToDos);

  if(event.target.dataset.status === 'on') {
    var notUrgentToDos = domToDos.filter(card => card.dataset.urgent === 'false');
    notUrgentToDos.forEach(card => card.style.display = 'none');
  } else {
    domToDos.forEach(card => card.style.display = 'block');
  }
}

function toggleNoUrgentMessage() {
  var urgentCount = 0;
  var domToDos = document.querySelectorAll('.main--to-do');
  domToDos = Array.from(domToDos);
  var urgentButton = document.getElementById('filter-by-urgent-button');
  
  for(var i = 0; i < domToDos.length; i++) {
    if(domToDos[i].dataset.urgent === 'true') {
      urgentCount++;
    }
  }
  
  if(urgentCount === 0 && urgentButton.dataset.status === 'on') {
    turnOnNoUrgentMessage();
  } else {
    turnOffNoUrgentMessage();
  }
}

function turnOnNoUrgentMessage(){
  main.insertAdjacentHTML('afterbegin', `
  <h2 id="main--no-urgent">No Urgent To Do Lists!</h1>
    `);
}

function turnOffNoUrgentMessage() {
  var noUrgentMessage = document.getElementById('main--no-urgent');
  
  if(noUrgentMessage !== null){
  noUrgentMessage.remove();
  }
}

function updateContentHandler(event) {
  event.preventDefault();

  if(event.target.classList.contains('li--task-span') || event.target.classList.contains('section--to-do-header')) {
    updateContentInStorage(event);
  }
}

function updateContentInStorage(event) {
  var currentId = event.target.closest('.main--to-do').dataset.id;
  var currentIndexOfCard = findToDo(currentId);
  
  if(event.target.className === 'li--task-span') {
    updateTaskContent(event, currentIndexOfCard);
  } else {
    updateTitleContent(event, currentIndexOfCard);
  }
}

function updateTaskContent(event, currentIndexOfCard) {
  var updatedText = event.target.innerText;
  var taskIndex = Number(event.target.closest('.ul--task').dataset.index);
  toDoArray[currentIndexOfCard].tasks[taskIndex].task = updatedText;
  toDoArray[currentIndexOfCard].saveUpdatedToLocal(toDoArray);
}

function updateTitleContent(event, currentIndexOfCard) {
  var updatedTitle = event.target.innerText;
  toDoArray[currentIndexOfCard].title = updatedTitle;
  toDoArray[currentIndexOfCard].saveUpdatedToLocal(toDoArray);
}