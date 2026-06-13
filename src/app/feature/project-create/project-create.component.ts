// project-create.component.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
import { catchError, finalize, throwError, Subscription } from 'rxjs';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  protected router = inject(Router);

  // Signals para manejar el estado de la UI
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Subscriptions para limpiar al destruir
  private startDateSubscription?: Subscription;
  private endDateSubscription?: Subscription;

  //Metodo auxiliar para evitar errores de comparacion
  private parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  // Validador - fecha no anterior a hoy
  validateNotPastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = this.parseLocalDate(control.value);

    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? { pastDate: true } : null;
  }

  // Calcular estado basado en fecha actual y rango del proyecto
  calculateStatus(startDateValue: string, endDateValue: string): string {
    if (!startDateValue || !endDateValue) {
      return '';
    }

    const startDate = this.parseLocalDate(startDateValue);
    const endDate = this.parseLocalDate(endDateValue);

    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Fechas inválidas
    if (startDate > endDate) {
      return '';
    }

    // Proyecto futuro
    if (startDate > today) {
      return 'PLANNED';
    }

    // Proyecto activo
    if (today >= startDate && today <= endDate) {
      return 'ACTIVE';
    }

    // Proyecto finalizado
    if (today > endDate) {
      return 'CLOSED';
    }

    return '';
  }

  // Validador de rango de fechas (fin no puede ser anterior a inicio)
  validateDateRange(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (!start || !end) {
      return null;
    }

    const startDate = this.parseLocalDate(start);
    const endDate = this.parseLocalDate(end);

    return startDate > endDate ? { startDateAfterEndDate: true } : null;
  }

  // Actualizar estado cuando cambian las fechas
  private updateStatus(): void {
    const startDate = this.projectForm.get('startDate')?.value;
    const endDate = this.projectForm.get('endDate')?.value;

    if (!startDate || !endDate) {
      this.projectForm.patchValue({ status: '' }, { emitEvent: false });
      return;
    }

    const status = this.calculateStatus(startDate, endDate);

    this.projectForm.patchValue({ status }, { emitEvent: false });
  }

  // Formulario reactivo
  projectForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required, this.validateNotPastDate.bind(this)]],
      endDate: ['', [Validators.required, this.validateNotPastDate.bind(this)]],
      status: [{ value: '', disabled: true }, [Validators.required]],
      description: [''],
    },
    { validators: this.validateDateRange.bind(this) },
  );

  ngOnInit() {
    // Suscribirse a cambios en startDate y endDate
    this.startDateSubscription = this.projectForm.get('startDate')?.valueChanges.subscribe(() => {
      this.updateStatus();
      // Re-validar endDate cuando cambia startDate
      this.projectForm.get('endDate')?.updateValueAndValidity();
    });

    this.endDateSubscription = this.projectForm.get('endDate')?.valueChanges.subscribe(() => {
      this.updateStatus();
    });
  }

  ngOnDestroy() {
    this.startDateSubscription?.unsubscribe();
    this.endDateSubscription?.unsubscribe();
  }

  // Getter para acceder a los campos en el template
  get f() {
    return this.projectForm.controls;
  }

  // Limpiar formulario
  resetForm() {
    this.projectForm.reset({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    this.updateStatus();
    this.projectForm.markAsPristine();
    this.projectForm.markAsUntouched();
    Object.keys(this.projectForm.controls).forEach((key) => {
      const control = this.projectForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.projectForm.get('status')?.enable();

    if (this.projectForm.invalid) {
      this.projectForm.get('status')?.disable();

      Object.keys(this.projectForm.controls).forEach((key) => {
        const control = this.projectForm.get(key);
        control?.markAsTouched();
      });
      this.projectForm.markAsTouched();

      this.errorMessage.set('Por favor, corrija los errores en el formulario');
      return;
    }

    this.isSubmitting.set(true);

    const projectData: ProjectRequestDTO = {
      name: this.projectForm.get('name')?.value,
      startDate: this.projectForm.get('startDate')?.value,
      endDate: this.projectForm.get('endDate')?.value,
      status: this.projectForm.get('status')?.value,
      description: this.projectForm.get('description')?.value,
    };

    this.projectService
      .createProject(projectData)
      .pipe(
        catchError((error) => {
          this.projectForm.get('status')?.disable();

          if (error.status === 400) {
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
        finalize(() => {
          this.isSubmitting.set(false);
          this.projectForm.get('status')?.disable();
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Proyecto creado correctamente');
          this.resetForm();

          setTimeout(() => {
            this.successMessage.set(null);
          }, 3000);
        },
      });
  }

  // Cancelar y limpiar formulario
  onCancel() {
    this.resetForm();
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.router.navigate(['/projects']);
  }
}
