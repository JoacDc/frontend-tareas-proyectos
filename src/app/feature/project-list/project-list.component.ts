import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../services/project.service';
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [DatePipe], // necesario para formatear fechas en la plantilla
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  // Vinculación directa a los Signals del servicio
  projects = this.projectService.projects;
  loading = this.projectService.loading;
  error = this.projectService.error;

  ngOnInit(): void {
    this.projectService.loadProjects();
  }

  /**
   * Retorna las clases de Tailwind según el estado del proyecto.
   */
  statusBadgeClass(status: string): string {
    const base = 'inline-block px-2 py-1 text-xs font-semibold rounded-full';
    switch (status) {
      case 'ACTIVE':
        return `${base} bg-green-100 text-green-800`;
      case 'PLANNED':
        return `${base} bg-blue-100 text-blue-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  }
}
