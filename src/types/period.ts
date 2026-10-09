export interface Period {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'scheduled';
  startDate: string;
  endDate: string;
  cohort: string;
  deliverablesCount: number;
}
