import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { TaskRequestDTO, TaskResponseDTO, TaskStatus } from '../core/models/task.model';

interface MockProject {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockTaskService {
  private tasks: TaskResponseDTO[] = [];
  private nextId: number = 1;

  /**
   * Crea una nueva tarea - simula POST /projects/{projectId}/tasks
   * @param projectId - ID del proyecto seleccionado
   * @param taskData - Datos de la tarea (TaskRequestDTO)
   * @returns Observable con TaskResponseDTO
   */
  createTask(projectId: number, taskData: TaskRequestDTO): Observable<TaskResponseDTO> {
    // Validaciones
    if (!projectId || projectId <= 0) {
      return throwError(() => new Error('Proyecto inválido'));
    }

    if (!taskData.title) {
      return throwError(() => new Error('El título es obligatorio'));
    }
    if (!taskData.estimatedHours || taskData.estimatedHours <= 0) {
      return throwError(() => new Error('Las horas estimadas deben ser mayores a 0'));
    }
    if (!taskData.assignee) {
      return throwError(() => new Error('El responsable es obligatorio'));
    }
    if (!taskData.status) {
      return throwError(() => new Error('El estado es obligatorio'));
    }
    if (!taskData.createdAt) {
      return throwError(() => new Error('La fecha de creación es obligatoria'));
    }
    if (!taskData.finishedAt) {
      return throwError(() => new Error('La fecha de finalización es obligatoria'));
    }

    const createdDate = new Date(taskData.createdAt);
    const finishedDate = new Date(taskData.finishedAt);
    if (finishedDate < createdDate) {
      return throwError(
        () => new Error('La fecha de finalización no puede ser anterior a la fecha de creación'),
      );
    }

    // Obtener nombre del proyecto mock
    const projectName = this.getMockProjectName(projectId);

    // Crear nueva tarea - Respuesta del backend
    const newTask: TaskResponseDTO = {
      id: this.nextId++,
      title: taskData.title,
      project: {
        id: projectId,
        name: projectName,
      },
      estimatedHours: taskData.estimatedHours,
      assignee: taskData.assignee,
      status: taskData.status,
      createdAt: taskData.createdAt.toISOString(),
      finishedAt: taskData.finishedAt.toISOString(),
    };

    this.tasks.push(newTask);

    return of(newTask).pipe(delay(200));
  }

  /**
   * Obtiene todas las tareas
   * @returns Array de TaskResponseDTO
   */
  getAllTasks(): TaskResponseDTO[] {
    return [...this.tasks];
  }

  /**
   * Obtiene lista de proyectos mock
   */
  getMockProjects(): Observable<MockProject[]> {
    const mockProjects: MockProject[] = [
      { id: 1, name: 'Proyecto Alpha', description: 'Proyecto principal de desarrollo' },
      { id: 2, name: 'Proyecto Beta', description: 'Proyecto de investigación' },
      { id: 3, name: 'Proyecto Gamma', description: 'Proyecto de infraestructura' },
    ];
    return of(mockProjects).pipe(delay(100));
  }

  /**
   * Obtiene el nombre de un proyecto por su ID
   */
  private getMockProjectName(projectId: number): string {
    const projects = [
      { id: 1, name: 'Proyecto Alpha' },
      { id: 2, name: 'Proyecto Beta' },
      { id: 3, name: 'Proyecto Gamma' },
    ];
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : 'Proyecto Desconocido';
  }
}
