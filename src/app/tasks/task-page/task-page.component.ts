import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NewTaskModalComponent } from '../new-task-modal/new-task-modal.component';
import { TimerComponent } from '../shared/timer/timer.component';
import { TaskListModel } from '../models/task-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskListService } from '../services/task-list.service';

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
    private router: Router
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
    console.log('Fetched tasks:', this.tasks);
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
            console.log('Delete canceled');
          },
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.deleteTask(taskId);
            console.log('Task list deleted');
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
    this.selectedTask = task;
    this.timerComponent.task = task;
    this.timerComponent.startTimer();
  }

  onTimerCompleted() {
    if (this.selectedTask) {
      const updatedTask: TaskModel = { ...this.selectedTask, completed: true };
      console.log('updatedTask is', updatedTask);

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
