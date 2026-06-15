import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRequestDTO, TaskResponseDTO } from '../core/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  createTask(projectId: number, taskData: TaskRequestDTO): Observable<TaskResponseDTO> {
    return this.http.post<TaskResponseDTO>(`${this.apiUrl}/projects/${projectId}/tasks`, taskData);
  }
}
