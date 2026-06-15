import { Component, EventEmitter, Output, signal, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../services/task.service';
import { TaskRequestDTO, TaskResponseDTO, TaskStatus } from '../../../../core/models/task.model';

export interface SimpleProject {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task-modal.component.html',
  styleUrls: [],
})
export class AddTaskModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<TaskResponseDTO>();
  @Input() projects: SimpleProject[] = [];

  showProjectSelection = signal<boolean>(false);
  selectedProject = signal<SimpleProject | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  taskForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
  ) {
    this.taskForm = this.fb.group(
      {
        title: ['', [Validators.required, Validators.minLength(1)]],
        estimatedHours: ['', [Validators.required, Validators.min(0.1)]],
        assignee: ['', [Validators.required, Validators.minLength(1)]],
        status: ['', [Validators.required]],
        createdAt: ['', [Validators.required]],
        finishedAt: ['', [Validators.required]],
      },
      { validators: this.dateValidator },
    );
  }

  ngOnInit(): void {}

  private dateValidator(group: AbstractControl): ValidationErrors | null {
    const createdAt = group.get('createdAt')?.value;
    const finishedAt = group.get('finishedAt')?.value;

    if (createdAt && finishedAt) {
      const createdDate = new Date(createdAt);
      const finishedDate = new Date(finishedAt);

      if (finishedDate < createdDate) {
        return { invalidDateRange: true };
      }
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return (field?.invalid && (field?.touched || this.submitted)) ?? false;
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);

    if (field?.hasError('required')) {
      switch (fieldName) {
        case 'title':
          return 'El título es obligatorio';
        case 'estimatedHours':
          return 'Las horas estimadas son obligatorias';
        case 'assignee':
          return 'El responsable es obligatorio';
        case 'status':
          return 'El estado es obligatorio';
        case 'createdAt':
          return 'La fecha de creación es obligatoria';
        case 'finishedAt':
          return 'La fecha de finalización es obligatoria';
        default:
          return 'Este campo es obligatorio';
      }
    }

    if (field?.hasError('min')) {
      return 'Las horas estimadas deben ser mayores a 0';
    }

    if (fieldName === 'finishedAt' && this.taskForm.hasError('invalidDateRange')) {
      return 'La fecha de finalización no puede ser anterior a la fecha de creación';
    }

    return '';
  }

  onContinue(): void {
    this.submitted = true;

    if (this.taskForm.valid) {
      this.showProjectSelection.set(true);
      this.errorMessage.set(null);
    } else {
      Object.keys(this.taskForm.controls).forEach((key) => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
      this.errorMessage.set('Por favor complete todos los campos obligatorios');
    }
  }

  selectProject(project: SimpleProject): void {
    this.selectedProject.set(project);
  }

  isProjectSelected(): boolean {
    return this.selectedProject() !== null;
  }

  onSaveTask(): void {
    if (!this.isProjectSelected()) {
      this.errorMessage.set('Debe seleccionar un proyecto antes de guardar la tarea');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const taskData: TaskRequestDTO = {
      title: this.taskForm.get('title')?.value,
      estimatedHours: Number(this.taskForm.get('estimatedHours')?.value),
      assignee: this.taskForm.get('assignee')?.value,
      status: this.taskForm.get('status')?.value as TaskStatus,
      createdAt: new Date(this.taskForm.get('createdAt')?.value),
      finishedAt: new Date(this.taskForm.get('finishedAt')?.value),
    };

    this.taskService.createTask(this.selectedProject()!.id, taskData).subscribe({
      next: (createdTask: TaskResponseDTO): void => {
        this.isLoading.set(false);
        this.taskCreated.emit(createdTask);
        this.closeModal();
      },
      error: (error: Error): void => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Error al crear la tarea');
        console.error('Error:', error);
      },
    });
  }

  resetModal(): void {
    this.taskForm.reset();
    this.submitted = false;
    this.showProjectSelection.set(false);
    this.selectedProject.set(null);
    this.errorMessage.set(null);
  }

  closeModal(): void {
    this.resetModal();
    this.close.emit();
  }

  goBack(): void {
    this.showProjectSelection.set(false);
    this.selectedProject.set(null);
    this.errorMessage.set(null);
  }
}
