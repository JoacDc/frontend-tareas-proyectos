// project-create.component.ts
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { ProjectRequestDTO } from '../../core/models/project.request.dto';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  protected router = inject(Router);

  // Signals para manejar el estado de la UI
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Validador síncrono simple - fecha no anterior a hoy
  validateNotPastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { pastDate: true };
    }

    return null;
  }

  // Validador de rango de fechas
  validateDateRange(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(end) < new Date(start)) {
      return { endDateInvalid: true };
    }

    return null;
  }

  // Formulario reactivo
  projectForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required, this.validateNotPastDate.bind(this)]],
      endDate: ['', [Validators.required, this.validateNotPastDate.bind(this)]],
      status: ['', [Validators.required]],
      description: [''],
    },
    { validators: this.validateDateRange.bind(this) },
  );

  // Validador personalizado: fecha fin >= fecha inicio
  private endDateAfterStartDateValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && new Date(end) < new Date(start)) {
      return { endDateInvalid: 'La fecha de fin debe ser igual o posterior a la fecha de inicio' };
    }
    return null;
  }

  // Getter para acceder fácil a los campos en el template
  get f() {
    return this.projectForm.controls;
  }

  onSubmit() {
    // Limpiar mensajes previos
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Validación cliente (campos obligatorios)
    if (this.projectForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.projectForm.controls).forEach((key) => {
        const control = this.projectForm.get(key);
        control?.markAsTouched();
      });
      // También marcamos el validador cross-field
      this.projectForm.markAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const projectData: ProjectRequestDTO = this.projectForm.value;

    this.projectService
      .createProject(projectData)
      .pipe(
        catchError((error) => {
          // Manejo de errores según código HTTP
          if (error.status === 400) {
            // Intenta extraer mensaje del backend (puede ser error.error.mensaje o error.message)
            const backendMsg =
              error.error?.message ||
              error.error?.error ||
              'Solicitud incorrecta. Verifique los datos.';
            this.errorMessage.set(backendMsg);
          } else if (error.status === 500) {
            this.errorMessage.set('Error del servidor. Intente nuevamente más tarde');
          } else {
            this.errorMessage.set('Ocurrió un error inesperado');
          }
          return throwError(() => error);
        }),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: () => {
          // Éxito (código 201)
          this.successMessage.set('Proyecto creado correctamente');
          // Redirigir al listado después de 1 segundo
          setTimeout(() => {
            this.router.navigate(['/projects']); // Ajusta la ruta de tu listado
          }, 1000);
        },
      });
  }
}
