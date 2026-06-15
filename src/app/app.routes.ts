import { Routes } from '@angular/router';
import { AddTaskModalComponent } from './feature/task-create/components/add-task-modal/add-task-modal.component';
import { ProjectListComponent } from './feature/project-list/project-list.component';
import { ProjectCreateComponent } from './feature/project-create/project-create.component';

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/create', component: ProjectCreateComponent },
  { path: 'tasks/create', component: AddTaskModalComponent },
  { path: '**', redirectTo: '/projects' },
];
