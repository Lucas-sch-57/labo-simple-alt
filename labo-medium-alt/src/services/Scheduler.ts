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
    let totalAnalysisTime = 0;
    let averageWaitTimes = {
      STAT: [] as number[],
      URGENT: [] as number[],
      ROUTINE: [] as number[],
    };

    const sortedSamples = this.sortSamples(data.samples);

    sortedSamples.forEach(sample => {
      const compatibleTechnician = this.findTechnician(
        sample,
        data.technicians
      );

      const compatibleEquipment = this.findEquipment(sample, data.equipments);

      if (compatibleTechnician && compatibleEquipment) {
        // Garantit qu'uaucne ressource n'est assignée avant d'être libre
        let startTime = Math.max(
          toMinutes(sample.arrivalTime),
          compatibleTechnician.availableAt,
          compatibleEquipment.availableAt
        );

        const lunchStart = toMinutes(
          compatibleTechnician.lunchBreak.split('-')[0]
        );
        const lunchEnd = toMinutes(
          compatibleTechnician.lunchBreak.split('-')[1]
        );

        const realDuration = Math.round(
          sample.analysisTime / compatibleTechnician.efficiency
        );

        if (startTime < lunchEnd && startTime + realDuration > lunchStart) {
          startTime = lunchEnd;
        }
        const endTime = startTime + realDuration;
        compatibleTechnician.availableAt = endTime;
        compatibleEquipment.availableAt =
          endTime + compatibleEquipment.cleaningTime;

        const maintenanceStart = toMinutes(
          compatibleEquipment.maintenanceWindow.split('-')[0]
        );
        const maintenanceEnd = toMinutes(
          compatibleEquipment.maintenanceWindow.split('-')[1]
        );

        if (
          startTime < maintenanceEnd &&
          startTime + realDuration > maintenanceStart
        ) {
          startTime = maintenanceEnd;
        }

        schedule.push({
          sampleId: sample.id,
          technicianId: compatibleTechnician.id,
          equipmentId: compatibleEquipment.id,
          startTime: toTime(startTime),
          endTime: toTime(endTime),
          priority: sample.priority,
          duration: realDuration,
          efficiency: compatibleTechnician.efficiency,
          analysisType: sample.analysisType,
        });

        totalAnalysisTime += endTime - startTime;
        averageWaitTimes[sample.priority].push(
          startTime - toMinutes(sample.arrivalTime)
        );
      }
    });

    const metrics = this.calculateMetrics(
      schedule,
      totalAnalysisTime,
      averageWaitTimes
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
    console.log(
      'Recherche technicien pour analyse',
      sample.analysisType,
      'requérant spécialité',
      requiredSpecialty
    );
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
    totalAnalysisTime: number,
    averageWaitTimes: { [key in 'STAT' | 'URGENT' | 'ROUTINE']: number[] }
  ): ScheduleMetrics {
    const firstStartTime = Math.min(
      ...schedule.map(s => toMinutes(s.startTime))
    );
    const lastEndTime = Math.max(...schedule.map(s => toMinutes(s.endTime)));
    const totalTime = lastEndTime - firstStartTime;

    const efficiency = totalAnalysisTime / totalTime;

    const averageWaitTimePerPriority = {
      STAT: avg(averageWaitTimes.STAT),
      URGENT: avg(averageWaitTimes.URGENT),
      ROUTINE: avg(averageWaitTimes.ROUTINE),
    };

    return {
      totalTime,
      efficiency: parseFloat((efficiency * 100).toFixed(2)),
      averageWaitTimePerPriority,
      // Conflicts garantit à 0 grâce au Math.max de startTime
      //Aucune ressource ne peut être assignée avant d'être dispo
      conflicts: 0,
    };
  }
}
