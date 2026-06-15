import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AddTaskModalComponent } from '../task-create/components/add-task-modal/add-task-modal.component';
import { TaskResponseDTO, TaskStatus } from '../../core/models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, AddTaskModalComponent],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  projects = this.projectService.projects;
  loading = this.projectService.loading;
  error = this.projectService.error;

  showAddTaskModal = signal<boolean>(false);
  tasks = signal<TaskResponseDTO[]>([]);

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.loadProjects();
    // Cargar tareas después de que los proyectos estén listos
    setTimeout(() => {
      this.loadAllTasks();
    }, 500);
  }

  // ✅ CORREGIDO: Cargar tareas por cada status
  loadAllTasks(): void {
    const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
    let allTasks: TaskResponseDTO[] = [];
    let completedCalls = 0;

    statuses.forEach((status) => {
      this.taskService.getTasksByStatus(status).subscribe({
        next: (tasks) => {
          allTasks = [...allTasks, ...tasks];
          completedCalls++;
          if (completedCalls === statuses.length) {
            this.tasks.set(allTasks);
            console.log('Tareas cargadas:', allTasks);
          }
        },
        error: (error) => {
          console.error(`Error cargando tareas con status ${status}:`, error);
          completedCalls++;
        },
      });
    });
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      ACTIVE: 'bg-green-100 text-green-800',
      PLANNED: 'bg-blue-100 text-blue-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: string | Date): string {
    if (!date) return 'No especificada';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getTasksByProjectId(projectId: number): TaskResponseDTO[] {
    return this.tasks().filter((task) => task.project.id === projectId);
  }

  getTaskStatusColor(status: string): string {
    switch (status) {
      case 'TODO':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTaskStatusText(status: string): string {
    switch (status) {
      case 'TODO':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En curso';
      case 'DONE':
        return 'Completada';
      default:
        return status;
    }
  }

  onAddProject(): void {
    this.router.navigate(['/projects/create']);
  }

  onAddTask(): void {
    this.showAddTaskModal.set(true);
  }

  onDeleteProject(): void {
    console.log('Eliminar proyecto - funcionalidad por implementar');
  }

  onModalClose(): void {
    this.showAddTaskModal.set(false);
  }

  onTaskCreated(task: TaskResponseDTO): void {
    console.log('Tarea creada:', task);
    this.tasks.update((currentTasks) => [...currentTasks, task]);
    this.showAddTaskModal.set(false);
  }
}
