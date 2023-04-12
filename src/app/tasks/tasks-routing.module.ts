import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TaskPageComponent } from './task-page/task-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tasks.module').then((m) => m.TasksModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
