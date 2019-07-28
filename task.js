class Task {
  constructor(taskObj) {
    this.task = taskObj.task;
    this.complete = taskObj.complete || false;
  }

  toggleComplete() {
    this.complete = !this.complete;
  }
}