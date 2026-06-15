export interface ProjectResponseDTO {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED';
  description: string | null;
}
