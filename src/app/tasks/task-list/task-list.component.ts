import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskListService } from '../services/task-list.service'; // <-- Import the new TaskListService
import { TaskListModel } from '../models/task-list.model';
import { TaskModel } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  @Input() taskList: TaskListModel | null = null;

  taskListData: Partial<TaskListModel> = {
    name: '',
    description: '',
  };

  constructor(
    private modalController: ModalController,
    private taskListService: TaskListService
  ) {}

  ngOnInit() {
    console.log('task-list.component openened and input si', this.taskList);
    if (this.taskList) {
      console.log('taskList is', this.taskList);
      this.taskListData = { ...this.taskList };
    } else {
      this.taskListData = {
        name: '',
        description: '',
      };
    }
  }

  async onSave() {
    if (this.taskList) {
      let tTasks: TaskModel[] = this.taskList.tasks || [];

      // Create a new TaskListModel instance with the updated data
      const updatedTaskListData = new TaskListModel(
        this.taskListData.name ?? '',
        this.taskListData.description ?? '',
        tTasks
      );
      updatedTaskListData.id = this.taskList.id;

      // Assign the updated values to the taskList object
      this.taskList.id = updatedTaskListData.id;
      this.taskList.name = updatedTaskListData.name;
      this.taskList.description = updatedTaskListData.description;
      this.taskList.tasks = updatedTaskListData.tasks;

      // Pass the updated taskList to the taskListService
      await this.taskListService.updateTaskList(this.taskList);
    } else {
      await this.taskListService.createTaskList(
        this.taskListData as Omit<TaskListModel, 'id'>
      );
    }
    this.modalController.dismiss(true);
  }

  onCancel() {
    this.modalController.dismiss();
  }
}
