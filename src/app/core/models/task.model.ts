// src/app/models/task.model.ts

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Request DTO - lo que envías al backend para crear/actualizar una tarea
export interface TaskRequestDTO {
  title: string;
  estimatedHours: number;
  assignee: string;
  status: TaskStatus;
  finishedAt: Date; // Formato ISO: "2026-06-17T14:30:00"
  createdAt: Date; // Formato ISO: "2026-06-17T09:00:00"
}

// Response DTO - lo que recibes del backend
export interface TaskResponseDTO {
  id: number;
  title: string;
  project: {
    id: number;
    name: string;
  };
  estimatedHours: number;
  assignee: string;
  status: TaskStatus;
  createdAt: string;
  finishedAt: string;
}
