import { Routes } from '@angular/router';
import { ProjectListComponent } from './feature/project-list/project-list.component';
import { ProjectCreateComponent } from './feature/project-create/project-create.component';

export const routes: Routes = [
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: ProjectCreateComponent },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
];
