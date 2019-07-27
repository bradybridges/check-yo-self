class Task {
  constructor(task) {
    this.task = task;
    this.complete = false;
  }

  toggleComplete() {
    this.complete = !this.complete;
  }
}