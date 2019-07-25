class ToDoList {
  constructor(toDoObj) {
    this.id = toDoObj.id;
    this.title = toDoObj.title;
    this.tasks = toDoObj.tasks;
    this.urgency = toDoObj.urgency;
  }

  saveToStorage(array) {
    array = array.filter(element => element.id !== this.id);
    array.push(this);
    localStorage.setItem('toDoArray', JSON.stringify(array));
    return array;
  }

  deleteFromStorage(array) {
    array = array.filter(element => element.id !== this.id);
    localStorage.setItem('toDoArray', JSON.stringify(array));
    return array;
  }

  updateToDo(obj, toDo) {

  }

  updateTask() {

  }
}