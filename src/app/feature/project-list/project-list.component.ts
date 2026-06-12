import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
})

export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  // Vinculación directa a los Signals del servicio
  projects = this.projectService.projects;
  loading = this.projectService.loading;
  error = this.projectService.error;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.loadProjects();
  }

  // Método para obtener el color del badge según el estado
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      ACTIVE: 'bg-green-100 text-green-800',
      PLANNED: 'bg-blue-100 text-blue-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  // Método para formatear fechas a DD/MM/YYYY
  formatDate(date: string | Date): string {
    if (!date) return 'No especificada';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Métodos para los botones (placeholder)
  onAddProject(): void {
    console.log('Agregar proyecto - funcionalidad por implementar');
  }

  onAddTask(): void {
    console.log('Agregar tarea - funcionalidad por implementar');
  }

  onDeleteProject(): void {
    console.log('Eliminar proyecto - funcionalidad por implementar');
  }
}
