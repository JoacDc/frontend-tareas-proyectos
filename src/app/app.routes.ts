import { Routes } from '@angular/router';
import { AddTaskModalComponent } from './feature/task-create/components/add-task-modal/add-task-modal.component';

export const routes: Routes = [
  { path: 'create-task', component: AddTaskModalComponent },
  { path: '', redirectTo: '/create-task', pathMatch: 'full' },
];
