class ToDoList {
  constructor(toDoObj) {
    this.id = toDoObj.id;
    this.title = toDoObj.title;
    this.tasks = toDoObj.tasks;
    this.urgent = toDoObj.urgent || false;
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

  updateToDo(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.tasks = obj.tasks;
    this.urgent = obj.urgent;
  }

  saveUpdatedToLocal(array) {
    localStorage.setItem('toDoArray', JSON.stringify(array));
  }

  updateTask(tasks) {
    this.tasks = tasks;
  }
}