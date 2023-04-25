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

  update(taskListData: TaskListModel) {
    this.id = taskListData.id ?? this.id;
    this.name = taskListData.name ?? this.name;
    this.description = taskListData.description ?? this.description;
    this.tasks = taskListData.tasks ?? this.tasks;
  }
}

export interface TaskListData {
  name: string;
  description: string;
  tasks: TaskModel[];
}
