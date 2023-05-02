import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TaskService } from '../tasks/services/task.service';
import { TaskListService } from '../tasks/services/task-list.service';
import { TaskListData, TaskListModel } from '../tasks/models/task-list.model';
import { TaskModel } from '../tasks/models/task.model';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../shared/services/toast-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(
    private storage: Storage,
    private router: Router,
    private alertController: AlertController,
    private taskService: TaskService,
    private taskListService: TaskListService,
    private httpClient: HttpClient,
    private toastService: ToastService
  ) {}

  async purgeLocalStorage() {
    await this.storage.clear();
  }

  async presentConfirmPurge() {
    const alert = await this.alertController.create({
      header: 'Confirm Purge',
      message: 'Are you sure you want to purge local storage?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.toastService.presentToast('Database Reset Cancelled');
          },
        },
        {
          text: 'Purge',
          handler: () => {
            this.taskListService.purgeLocalStorage();
            this.toastService.presentToast('Database Reset Successful');
          },
        },
      ],
    });

    await alert.present();
  }

  goHome() {
    this.router.navigate(['/tasks']);
  }

  async addSeedTaskList() {
    const seedDataUrl = './assets/data/seed-data.json';
    const seedData = (await this.httpClient
      .get<{
        name: string;
        description: string;
        tasks: Omit<TaskModel, 'id'>[];
      }>(seedDataUrl)
      .toPromise()) as TaskListModel;

    const taskListData: TaskListData = {
      name: seedData.name,
      description: seedData.description,
      tasks: [],
    };

    const createdTaskList = await this.taskListService.createTaskList(
      taskListData
    );

    const tasks: Omit<TaskModel, 'id'>[] = seedData.tasks.map((task) => ({
      ...task,
      taskListId: createdTaskList.id,
    }));

    for (const task of tasks) {
      await this.taskService.createTask(task);
    }

    await this.toastService.presentToast(
      'Sample Task List created successfully!'
    );
  }
}
