import { Routes } from '@angular/router';
import { ProjectListComponent } from './feature/project-list/project-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'proyectos', pathMatch: 'full' },

  { path: 'proyectos', component: ProjectListComponent },

  { path: '**', redirectTo: 'proyectos' }
];
