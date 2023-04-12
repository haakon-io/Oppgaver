import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskListService } from '../services/task-list.service'; // <-- Import the new TaskListService
import { TaskListModel } from '../models/task-list.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  @Input() taskList: TaskListModel | null = null;
  taskListData: Partial<TaskListModel> | null = null;

  constructor(
    private modalController: ModalController,
    private taskListService: TaskListService
  ) {}

  ngOnInit() {
    if (this.taskList) {
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
      await this.taskListService.updateTaskList(this.taskList as TaskListModel); // <-- Update to use TaskListService
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
