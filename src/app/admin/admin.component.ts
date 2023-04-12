import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TaskService } from '../tasks/services/task.service';
import { TaskListService } from '../tasks/services/task-list.service';
import { TaskListModel } from '../tasks/models/task-list.model';
import { TaskModel } from '../tasks/models/task.model';
import { HttpClient } from '@angular/common/http';

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
    private toastController: ToastController,
    private taskService: TaskService,
    private taskListService: TaskListService,
    private httpClient: HttpClient
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
            console.log('Purge canceled');
          },
        },
        {
          text: 'Purge',
          handler: () => {
            this.taskListService.purgeLocalStorage();
            console.log('Local storage purged');
          },
        },
      ],
    });

    await alert.present();
  }

  goHome() {
    this.router.navigate(['/tasks']);
  }

  // async addSeedTaskList() {
  //   const taskListData: Omit<TaskListModel, 'id'> = {
  //     name: 'Sample Task List',
  //     description: 'A sample task list with some tasks',
  //     tasks: [],
  //   };

  //   const createdTaskList = await this.taskListService.createTaskList(
  //     taskListData
  //   );

  //   const tasks: Omit<TaskModel, 'id'>[] = [
  //     {
  //       taskListId: createdTaskList.id,
  //       name: 'Sample Task 1',
  //       description: 'A sample task 1',
  //       completed: false,
  //       timeLength: 25,
  //     },
  //     {
  //       taskListId: createdTaskList.id,
  //       name: 'Sample Task 2',
  //       description: 'A sample task 2',
  //       completed: false,
  //       timeLength: 15,
  //     },
  //     {
  //       taskListId: createdTaskList.id,
  //       name: 'Sample Task 3',
  //       description: 'A sample task 3',
  //       completed: false,
  //       timeLength: 45,
  //     },
  //   ];

  //   for (const task of tasks) {
  //     await this.taskService.createTask(task);
  //   }

  //   await this.presentToast('Sample Task List created successfully!');
  // }

  async addSeedTaskList() {
    const seedDataUrl = './assets/data/seed-data.json';

    // Fetch seed data from the JSON file
    // const seedData = await this.httpClient
    //   .get<{
    //     name: string;
    //     description: string;
    //     tasks: Omit<TaskModel, 'id'>[];
    //   }>(seedDataUrl)
    //   .toPromise();
    const seedData = (await this.httpClient
      .get<{
        name: string;
        description: string;
        tasks: Omit<TaskModel, 'id'>[];
      }>(seedDataUrl)
      .toPromise()) as TaskListModel;

    const taskListData: Omit<TaskListModel, 'id'> = {
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

    await this.presentToast('Sample Task List created successfully!');
  }

  async presentToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
    });

    await toast.present();
  }
}
