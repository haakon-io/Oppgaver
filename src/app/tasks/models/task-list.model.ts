import { TaskModel } from './task.model';
import { v4 as uuidv4 } from 'uuid';

export class TaskListModel {
  id: string;
  name: string;
  tasks: TaskModel[];
  description: string;

  constructor(name: string, description: string = '', tasks: TaskModel[] = []) {
    this.id = uuidv4();
    this.name = name;
    this.tasks = tasks;
    this.description = description;
  }
}
