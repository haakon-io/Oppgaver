import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.scss'],
})
export class NewTaskModalComponent implements OnInit {
  @Input() task: (Partial<TaskModel> & { id: number }) | null = null;
  @Input() taskListId: string = '';
  taskData: Partial<TaskModel> | null = null;

  constructor(
    private modalController: ModalController,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.task) {
      this.taskData = { ...this.task };
    } else {
      this.taskData = {
        taskListId: this.taskListId,
        name: '',
        description: '',
        completed: false,
        timeLength: 0,
      };
    }
  }

  async onSubmit() {
    if (this.task) {
      await this.taskService.updateTask(this.taskData as TaskModel);
    } else {
      await this.taskService.createTask(this.taskData as TaskModel);
    }
    this.modalController.dismiss(true);
  }

  onCancel() {
    this.modalController.dismiss();
  }

  toggleTime(task: Partial<TaskModel>) {
    if (task && task.timedTask !== null) {
      task.timedTask = !task.timedTask;
    }
    if (task.timedTask === false) {
      task.timeLength = 0;
    }
  }
}
