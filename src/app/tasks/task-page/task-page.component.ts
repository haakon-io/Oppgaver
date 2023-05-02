import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NewTaskModalComponent } from '../new-task-modal/new-task-modal.component';
import { TimerComponent } from '../shared/timer/timer.component';
import { TaskListModel } from '../models/task-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskListService } from '../services/task-list.service';
import { ToastService } from 'src/app/shared/services/toast-service.service';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss'],
})
export class TaskPageComponent implements OnInit {
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  @Input() taskList: TaskListModel | null = null;
  tasks: TaskModel[] = [];
  selectedTask: TaskModel | null = null;
  taskListId: string | null = null;

  constructor(
    private taskService: TaskService,
    private taskListService: TaskListService,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private toastSvc: ToastService
  ) {}

  async ngOnInit() {
    this.taskListId = this.route.snapshot.paramMap.get('taskListId');
    if (this.taskListId) {
      this.taskList = await this.taskListService.getTaskListById(
        this.taskListId
      );
    }
    this.fetchTasks();
  }

  async fetchTasks() {
    if (this.taskList) {
      this.tasks = await this.taskService.getTasksByTaskListId(
        this.taskList.id
      );
    } else {
      this.tasks = await this.taskService.getTasks();
    }
  }

  async openNewTaskModal(taskToEdit?: TaskModel) {
    const modal = await this.modalController.create({
      component: NewTaskModalComponent,
      componentProps: {
        task: taskToEdit || null,
        taskListId: this.taskListId,
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await this.fetchTasks(); // Refresh the tasks list after the modal is dismissed
      }
    });

    return await modal.present();
  }

  toggleTask(task: TaskModel) {
    this.selectedTask = this.selectedTask === task ? null : task;
  }

  async editTask(task: TaskModel) {
    const modal = await this.modalController.create({
      component: NewTaskModalComponent,
      componentProps: {
        task: { ...task },
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await this.fetchTasks(); // Refresh the tasks list after the modal is dismissed
      }
    });

    return await modal.present();
  }

  async presentConfirmDelete(taskId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Delete Task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.toastSvc.presentToast('Delete Cancelled');
          },
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.deleteTask(taskId);
            this.toastSvc.presentToast('Task list deleted');
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteTask(taskId: number) {
    await this.taskService.deleteTask(taskId);
    await this.fetchTasks(); // Refresh the tasks list after deleting a task
  }

  startTimer(task: TaskModel) {
    if (this.timerComponent.timerRunning) {
      this.toastSvc.presentToast('A timer is already running');
      return;
    }

    this.selectedTask = task;
    this.timerComponent.task = task;
    this.timerComponent.startTimer();

    // Subscribe to the timerAlreadyRunning event
    this.timerComponent.timerAlreadyRunning.subscribe(() => {
      this.toastSvc.presentToast('A timer is already running');
    });
  }

  onTimerCompleted() {
    if (this.selectedTask) {
      const updatedTask: TaskModel = { ...this.selectedTask, completed: true };
      this.taskService.updateTask(updatedTask);
      // Update the tasks array with the updated task
      const taskIndex = this.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = updatedTask;
      }
    }
  }

  goToTasksHome() {
    this.router.navigate(['/tasks']);
  }
}
