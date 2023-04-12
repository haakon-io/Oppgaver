import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { TasksHomeComponent } from './tasks/tasks-home/tasks-home.component';
import { TaskPageComponent } from './tasks/task-page/task-page.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: 'task-page/:taskListId',
    component: TaskPageComponent,
  },
  {
    path: 'tasks',
    component: TasksHomeComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: '',
    component: TasksHomeComponent,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
