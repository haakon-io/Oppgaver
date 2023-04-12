import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NewTaskModalComponent } from './new-task-modal/new-task-modal.component';
import { TaskService } from './services/task.service';
import { TaskPageComponent } from './task-page/task-page.component';
import { TimerComponent } from './shared/timer/timer.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TasksHomeComponent } from './tasks-home/tasks-home.component';
import { AdminComponent } from '../admin/admin.component';
import { AutofocusDirective } from './shared/directives/autofocus';

@NgModule({
  declarations: [
    TasksHomeComponent,
    TaskPageComponent,
    NewTaskModalComponent,
    TaskListComponent,
    TimerComponent,
    AdminComponent,
    AutofocusDirective,
  ],
  imports: [CommonModule, IonicModule, FormsModule],
  providers: [TaskService],
})
export class TasksModule {}
