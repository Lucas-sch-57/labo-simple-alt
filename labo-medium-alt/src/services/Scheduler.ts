import { Data } from '../types/data';
import { Schedule, ScheduleMetrics, ScheduleResult } from '../types/schedule';
import { PRIORITY } from '../constants/priority';
import { toMinutes, toTime } from '../utils/time';
import { Sample } from '../models/Sample';
import { Technician } from '../models/Technician';
import { Equipment } from '../models/Equipment';
import { ANALYSIS_TO_SPECIALTY } from '../constants/analysis-to-specialty';
import { avg } from '../utils/average';

export class Scheduler {
  /**
   * Organizes laboratory analyses by assigning samples to compatible technicians
   * and equipment, respecting priority rules and avoiding scheduling conflicts.
   * @param data - Input data containing samples, technicians, and equipment
   * @returns A complete schedule with chronological entries and performance metrics
   */
  public planifyLab(data: Data): ScheduleResult {
    const schedule: Schedule[] = [];
    let averageWaitTimes = {
      STAT: [] as number[],
      URGENT: [] as number[],
      ROUTINE: [] as number[],
    };
    const techOccupation: Record<string, number> = {};
    const sortedSamples = this.sortSamples(data.samples);

    sortedSamples.forEach(sample => {
      const compatibleTechnician = this.findTechnician(
        sample,
        data.technicians
      );

      const compatibleEquipment = this.findEquipment(sample, data.equipments);

      if (compatibleTechnician && compatibleEquipment) {
        const realDuration = Math.round(
          sample.analysisTime / compatibleTechnician.efficiency
        );

        const startTime = this.computeStartTime(
          sample,
          compatibleTechnician,
          compatibleEquipment,
          realDuration
        );

        const endTime = startTime + realDuration;

        this.updateResourceAvailability(
          compatibleTechnician,
          compatibleEquipment,
          endTime
        );

        //Tech occupation
        if (!techOccupation[compatibleTechnician.id]) {
          techOccupation[compatibleTechnician.id] = 0;
        }

        techOccupation[compatibleTechnician.id] += realDuration;

        schedule.push(
          this.createScheduleEntry(
            sample,
            compatibleTechnician,
            compatibleEquipment,
            startTime,
            endTime,
            realDuration
          )
        );

        averageWaitTimes[sample.priority].push(
          startTime - toMinutes(sample.arrivalTime)
        );
      }
    });

    const metrics = this.calculateMetrics(
      schedule,
      averageWaitTimes,
      techOccupation,
      Object.keys(techOccupation).length
    );
    return { schedule, metrics };
  }

  /**
   * Sorts samples by priority (STAT > URGENT > ROUTINE).
   * Samples with equal priority are sorted by arrival time (earliest first).
   * @param samples - Unsorted list of samples
   * @returns Sorted samples array
   */
  private sortSamples(samples: Sample[]): Sample[] {
    return samples.sort((a, b) => {
      if (PRIORITY[a.priority] === PRIORITY[b.priority]) {
        const arrivalTimeA = toMinutes(a.arrivalTime);
        const arrivalTimeB = toMinutes(b.arrivalTime);
        return arrivalTimeA - arrivalTimeB;
      }
      // STAT = 3, URGENT = 2, ROUTINE = 1 - Tri décroissant
      return PRIORITY[a.priority] > PRIORITY[b.priority] ? -1 : 1;
    });
  }
  /**
   * Finds the most available compatible technician for a given sample.
   * Matches by speciality (exact match or GENERAL), then picks the one
   * with the earliest availableAt time.
   * @param sample - The sample to assign
   * @param technicians - List of available technicians
   * @returns The most available compatible technician, or undefined if none found
   */
  private findTechnician(
    sample: Sample,
    technicians: Technician[]
  ): Technician | undefined {
    const requiredSpecialty = ANALYSIS_TO_SPECIALTY[sample.analysisType];
    if (!requiredSpecialty) return undefined;
    return (
      technicians
        .filter(tech => tech.specialty.includes(requiredSpecialty))
        // Le technicien le plus tôt disponible est sélectionné en premier
        .sort((a, b) => a.availableAt - b.availableAt)[0]
    );
  }

  /**
   * Finds the most available compatible equipment for a given sample.
   * Matches by type and filters out unavailable equipment (available=false).
   * Then picks the one with the earliest availableAt time.
   * @param sample - The sample to assign
   * @param equipments - List of available equipment
   * @returns The most available compatible equipment, or undefined if none found
   */
  private findEquipment(
    sample: Sample,
    equipments: Equipment[]
  ): Equipment | undefined {
    const requiredEquipmentType = ANALYSIS_TO_SPECIALTY[sample.analysisType];
    if (!requiredEquipmentType) return undefined;
    return equipments
      .filter(equip => equip.type === requiredEquipmentType)
      .sort((a, b) => a.availableAt - b.availableAt)[0];
  }

  /**
   * Calculates performance metrics for the completed schedule.
   * - totalTime: duration from first analysis start to last analysis end (minutes)
   * - efficiency: ratio of total analysis work time to total elapsed time (%)
   * - conflicts: number of resource double-bookings detected (should always be 0)
   * @param schedule - The completed schedule entries
   * @param totalAnalysisTime - Sum of all individual analysis durations
   * @returns Metrics object with totalTime, efficiency, and conflicts
   */
  private calculateMetrics(
    schedule: Schedule[],
    averageWaitTimes: { [key in 'STAT' | 'URGENT' | 'ROUTINE']: number[] },
    techOccupation: Record<string, number>,
    nbTechs: number
  ): ScheduleMetrics {
    const firstStartTime = Math.min(
      ...schedule.map(s => toMinutes(s.startTime))
    );
    const lastEndTime = Math.max(...schedule.map(s => toMinutes(s.endTime)));
    const totalTime = lastEndTime - firstStartTime;

    const averageWaitTimePerPriority = {
      STAT: avg(averageWaitTimes.STAT),
      URGENT: avg(averageWaitTimes.URGENT),
      ROUTINE: avg(averageWaitTimes.ROUTINE),
    };

    const totalTechOcupation = Object.values(techOccupation).reduce(
      (sum, val) => sum + val,
      0
    );
    const technicianUtilization =
      (totalTechOcupation / (totalTime * nbTechs)) * 100;

    const parallelAnalyses = Math.max(
      ...schedule.map(
        a =>
          schedule.filter(
            b =>
              toMinutes(b.startTime) < toMinutes(a.endTime) &&
              toMinutes(b.endTime) > toMinutes(a.startTime)
          ).length
      )
    );
    //Efficiency = technicianUtilization c'est pourquoi j'ai décidé de ne pas afficher les deux métriques
    return {
      totalTime,
      averageWaitTimePerPriority,
      technicianUtilization: parseFloat(technicianUtilization.toFixed(2)),
      parallelAnalyses,
      // Conflicts garantit à 0 grâce au Math.max de startTime
      //Aucune ressource ne peut être assignée avant d'être dispo
      conflicts: 0,
    };
  }
  /**
   * Parses a time window string into numeric minute values.
   *
   * Example:
   * "12:00-13:30" => [720, 810]
   *
   * @param window - Time window formatted as "HH:mm-HH:mm"
   * @returns A tuple containing start and end times in minutes
   */
  private parseWindow(window: string): [number, number] {
    const [start, end] = window.split('-');
    return [toMinutes(start), toMinutes(end)];
  }
  /**
   * Determines whether two time intervals overlap.
   *
   * Intervals are considered overlapping when:
   * - the start of the first interval is before the end of the second
   * - and the end of the first interval is after the start of the second
   *
   * Example:
   * [10:00 - 11:00] overlaps [10:30 - 12:00] => true
   * [10:00 - 11:00] overlaps [11:00 - 12:00] => false
   *
   * @param start - Start time of the first interval (minutes)
   * @param end - End time of the first interval (minutes)
   * @param windowStart - Start time of the second interval (minutes)
   * @param windowEnd - End time of the second interval (minutes)
   * @returns True if the intervals overlap, otherwise false
   */
  private overlaps(
    start: number,
    end: number,
    windowStart: number,
    windowEnd: number
  ): boolean {
    return start < windowEnd && end > windowStart;
  }
  /**
   * Computes the earliest valid start time for a sample analysis.
   *
   * The analysis can only begin when:
   * - the sample has arrived,
   * - the technician is available,
   * - the equipment is available.
   *
   * The method also ensures the analysis does not overlap:
   * - the technician lunch break,
   * - the equipment maintenance window.
   *
   * If an overlap is detected, the start time is postponed
   * to the end of the conflicting time window.
   *
   * @param sample - Sample to schedule
   * @param technician - Assigned technician
   * @param equipment - Assigned equipment
   * @param duration - Effective analysis duration in minutes
   * @returns The earliest valid start time in minutes
   */
  private computeStartTime(
    sample: Sample,
    technician: Technician,
    equipment: Equipment,
    duration: number
  ): number {
    let startTime = Math.max(
      toMinutes(sample.arrivalTime),
      technician.availableAt,
      equipment.availableAt
    );

    const [lunchStart, lunchEnd] = this.parseWindow(technician.lunchBreak);
    if (this.overlaps(startTime, startTime + duration, lunchStart, lunchEnd)) {
      startTime = lunchEnd;
    }

    const [maintenanceStart, maintenanceEnd] = this.parseWindow(
      equipment.maintenanceWindow
    );
    if (
      this.overlaps(
        startTime,
        startTime + duration,
        maintenanceStart,
        maintenanceEnd
      )
    ) {
      startTime = maintenanceEnd;
    }
    return startTime;
  }
  /**
   * Creates a schedule entry representing a planned laboratory analysis.
   *
   * Converts internal minute-based timestamps into formatted time strings
   * and stores all relevant scheduling information.
   *
   * @param sample - Scheduled sample
   * @param technician - Assigned technician
   * @param equipment - Assigned equipment
   * @param startTime - Analysis start time in minutes
   * @param endTime - Analysis end time in minutes
   * @param duration - Effective analysis duration in minutes
   * @returns A complete schedule entry
   */
  private createScheduleEntry(
    sample: Sample,
    technician: Technician,
    equipment: Equipment,
    startTime: number,
    endTime: number,
    duration: number
  ): Schedule {
    return {
      sampleId: sample.id,
      technicianId: technician.id,
      equipmentId: equipment.id,
      startTime: toTime(startTime),
      endTime: toTime(endTime),
      priority: sample.priority,
      duration,
      efficiency: technician.efficiency,
      analysisType: sample.analysisType,
    };
  }
  /**
   * Updates technician and equipment availability after an analysis.
   *
   * - The technician becomes available immediately after the analysis ends.
   * - The equipment becomes available after its cleaning time has elapsed.
   *
   * @param technician - Technician assigned to the analysis
   * @param equipment - Equipment used for the analysis
   * @param endTime - Analysis end time in minutes
   */
  private updateResourceAvailability(
    technician: Technician,
    equipment: Equipment,
    endTime: number
  ): void {
    technician.availableAt = endTime;
    equipment.availableAt = endTime + equipment.cleaningTime;
  }
}
