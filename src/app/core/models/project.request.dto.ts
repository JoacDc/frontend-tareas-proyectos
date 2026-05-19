export interface ProjectRequestDTO {
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED';
  description?: string | null;
}
