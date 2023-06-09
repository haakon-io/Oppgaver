import { Component, OnInit } from '@angular/core';
import { TaskListModel } from '../models/task-list.model';
import { AlertController, ModalController } from '@ionic/angular';
import { TaskListComponent } from '../task-list/task-list.component';
import { Router } from '@angular/router';
import { TaskListService } from '../services/task-list.service';
import { ToastService } from 'src/app/shared/services/toast-service.service';

@Component({
  selector: 'app-tasks-home',
  templateUrl: './tasks-home.component.html',
  styleUrls: ['./tasks-home.component.scss'],
})
export class TasksHomeComponent implements OnInit {
  tasksListData: TaskListModel[] = [];

  constructor(
    private taskListService: TaskListService,
    private modalController: ModalController,
    private router: Router,
    private alertCtrl: AlertController,
    private toastSvc: ToastService
  ) {}

  async ngOnInit() {
    this.tasksListData = await this.taskListService.getTaskLists();
  }

  async addNewTaskList() {
    const modal = await this.modalController.create({
      component: TaskListComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.tasksListData = await this.taskListService.getTaskLists();
    }
  }

  editTaskList(taskList: TaskListModel) {
    this.router.navigate(['/task-page', taskList.id]);
  }

  async editTaskListItem(taskListItem: TaskListModel) {
    const modal = await this.modalController.create({
      component: TaskListComponent,
      componentProps: {
        taskList: { ...taskListItem },
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await this.fetchTaskLists(); // Refresh the tasks list after the modal is dismissed
      }
    });

    return await modal.present();
  }

  async fetchTaskLists() {
    if (this.tasksListData) {
      this.tasksListData = await this.taskListService.getTaskLists();
    }
  }

  async presentConfirmDelete(taskListId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Delete Task List?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.toastSvc.presentToast('Delete canceled');
          },
        },
        {
          text: 'Delete',
          handler: async () => {
            await this._deleteTaskList(taskListId);
            this.toastSvc.presentToast('Task list deleted');
          },
        },
      ],
    });

    await alert.present();
  }

  private async _deleteTaskList(taskListId: string) {
    await this.taskListService.deleteTaskList(taskListId);
    this.tasksListData = await this.taskListService.getTaskLists();
  }

  goToAdminSettings() {
    this.router.navigate(['/admin']);
  }
}
