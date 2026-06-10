import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectResponseDTO } from '../core/models/project.models';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'api/projects';

  // Signals para el estado
  projects = signal<ProjectResponseDTO[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ProjectResponseDTO[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error.set('No se pudieron cargar los proyectos. Por favor, intenta más tarde.');
        this.loading.set(false);
      },
    });
  }

  // Método alternativo si prefieres devolver el Observable
  getProjects() {
    return this.http.get<ProjectResponseDTO[]>(this.apiUrl);
  }
}
