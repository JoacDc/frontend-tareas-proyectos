import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ProjectResponseDTO } from '../core/models/project.model';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'api/projects';

  private _projects = signal<ProjectResponseDTO[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  loadProjects(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<ProjectResponseDTO[]>(this.apiUrl)
      .pipe(
        tap((response) => {
          console.log('Respuesta del backend:', response); // ← Para debug
          this._projects.set(response);
          this._loading.set(false);
        }),
        catchError((err) => {
          console.error('Error en la petición:', err); // ← Para debug
          this._error.set('No se pudieron cargar los proyectos. Intente nuevamente más tarde.');
          this._loading.set(false);
          return of([]);
        }),
      )
      .subscribe();
  }
}
