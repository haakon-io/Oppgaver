import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksKey = 'tasks';
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async createTask(task: Omit<TaskModel, 'id'>): Promise<TaskModel> {
    await this.init();
    const tasks = await this.getTasks();
    const newTask: TaskModel = { id: Date.now(), ...task };
    tasks.push(newTask);
    await this._storage?.set(this.tasksKey, tasks);
    return newTask;
  }

  async updateTask(task: TaskModel): Promise<void> {
    await this.init();
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === task.id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = task;
      await this._storage?.set(this.tasksKey, tasks);
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    await this.init();
    const tasks = await this.getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    await this._storage?.set(this.tasksKey, updatedTasks);
  }

  async getTasks(): Promise<TaskModel[]> {
    await this.init();
    const tasks = await this._storage?.get(this.tasksKey);
    return tasks ?? [];
  }

  async getTasksByTaskListId(taskListId: string): Promise<TaskModel[]> {
    await this.init();
    const tasks = await this.getTasks();
    return tasks.filter((task) => task.taskListId === taskListId);
  }

  async deleteTasksByTaskListId(taskListId: string): Promise<void> {
    await this.init();
    const tasks = await this.getTasks();
    const updatedTasks = tasks.filter((task) => task.taskListId !== taskListId);
    await this._storage?.set(this.tasksKey, updatedTasks);
  }
}
