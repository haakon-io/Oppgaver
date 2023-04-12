import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TaskListModel } from '../models/task-list.model';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
  private taskListsKey = 'taskLists';
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private taskService: TaskService) {
    this.init();
  }

  async init(): Promise<void> {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getTaskLists(): Promise<TaskListModel[]> {
    await this.init();
    const taskLists = await this._storage?.get(this.taskListsKey);
    return taskLists ?? [];
  }

  async createTaskList(
    taskListData: Omit<TaskListModel, 'id'>
  ): Promise<TaskListModel> {
    await this.init();
    const taskLists = await this.getTaskLists();
    const newTaskList = new TaskListModel(
      taskListData.name,
      taskListData.description
    );
    taskLists.push(newTaskList);
    await this._storage?.set(this.taskListsKey, taskLists);
    console.log('createTaskList called', newTaskList);
    return newTaskList;
  }

  async updateTaskList(taskList: TaskListModel): Promise<void> {
    await this.init();
    const taskLists = await this.getTaskLists();
    const taskListIndex = taskLists.findIndex((tl) => tl.id === taskList.id);
    if (taskListIndex !== -1) {
      taskLists[taskListIndex] = taskList;
      await this._storage?.set(this.taskListsKey, taskLists);
    }
  }

  async getTaskListById(taskListId: string): Promise<TaskListModel | null> {
    const taskLists = await this.getTaskLists();
    const taskList = taskLists.find((taskList) => taskList.id === taskListId);
    return taskList ?? null;
  }

  async deleteTaskList(taskListId: string): Promise<void> {
    await this.init();

    await this.taskService.deleteTasksByTaskListId(taskListId);
    const taskLists = await this.getTaskLists();
    const updatedTaskLists = taskLists.filter(
      (taskList) => taskList.id !== taskListId
    );
    await this._storage?.set(this.taskListsKey, updatedTaskLists);
  }

  async purgeLocalStorage() {
    await this._storage?.clear();
  }
}
