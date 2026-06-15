import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRequestDTO, TaskResponseDTO, TaskStatus } from '../core/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  createTask(projectId: number, taskData: any): Observable<TaskResponseDTO> {
    return this.http.post<TaskResponseDTO>(`${this.apiUrl}/projects/${projectId}/tasks`, taskData);
  }

  // ✅ CORREGIDO: GET /tasks?status=XXX
  getTasksByStatus(status: TaskStatus): Observable<TaskResponseDTO[]> {
    return this.http.get<TaskResponseDTO[]>(`${this.apiUrl}/tasks?status=${status}`);
  }

  // Opcional: Para traer todas las tareas (llama a los 3 estados)
  getAllTasks(): Observable<TaskResponseDTO[]> {
    // Esto no existe en el backend, mejor usa getTasksByStatus
    return this.http.get<TaskResponseDTO[]>(`${this.apiUrl}/tasks?status=TODO`);
  }
}
