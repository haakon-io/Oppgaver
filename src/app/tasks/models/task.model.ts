export class TaskModel {
  id: number;
  taskListId: string;
  name: string;
  description: string;
  completed: boolean;
  timeLength: number;

  constructor(
    id: number,
    taskListId: string,
    name: string,
    description: string,
    completed: boolean,
    timeLength: number
  ) {
    this.id = id;
    this.taskListId = taskListId;
    this.name = name;
    this.description = description;
    this.completed = completed;
    this.timeLength = timeLength;
  }
}
