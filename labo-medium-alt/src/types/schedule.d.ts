export interface Schedule {
  sampleId: string;
  technicianId: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  priority: 'URGENT' | 'STAT' | 'ROUTINE';
  duration: number;
  efficiency: number;
  analysisType: string;
}

export interface ScheduleMetrics {
  totalTime: number;
  conflicts: number;
  averageWaitTimePerPriority: {
    STAT: number;
    URGENT: number;
    ROUTINE: number;
  };
  technicianUtilization: number;
  parallelAnalyses: number;
}

export interface ScheduleResult {
  schedule: Schedule[];
  metrics: ScheduleMetrics;
}
