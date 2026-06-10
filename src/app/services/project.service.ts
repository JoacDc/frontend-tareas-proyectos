import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectResponseDTO } from '../core/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // Signals privadas
  private projectsSignal = signal<ProjectResponseDTO[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Exponer signals como solo lectura
  readonly projects = this.projectsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  private apiUrl = '/api/projects';

  constructor(private http: HttpClient) {}

  loadProjects(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<ProjectResponseDTO[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.projectsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.errorSignal.set('Error al cargar los proyectos. Intente nuevamente.');
        this.loadingSignal.set(false);
      },
    });
  }
}
