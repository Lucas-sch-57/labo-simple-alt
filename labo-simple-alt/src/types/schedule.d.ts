export interface Schedule {
  sampleId: string;
  technicianId: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  priority: 'URGENT' | 'STAT' | 'ROUTINE';
}

export interface ScheduleMetrics {
  totalTime: number;
  efficiency: number;
  conflicts: number;
}

export interface ScheduleResult {
  schedule: Schedule[];
  metrics: ScheduleMetrics;
}
