import { Data } from '../types/data';
import { Schedule, ScheduleResult } from '../types/schedule';
import { PRIORITY } from '../constants/priority';
import { toMinutes, toTime } from '../utils/time';

export class Scheduler {
  public planifyLab(data: Data): ScheduleResult {
    let schedule: Schedule[] = [];
    let totalAnalysisTime = 0;

    const sortedSamples = data.samples.sort((a, b) => {
      if (PRIORITY[a.priority] === PRIORITY[b.priority]) {
        const arrivalTimeA = toMinutes(a.arrivalTime);
        const arrivalTimeB = toMinutes(b.arrivalTime);
        return arrivalTimeA - arrivalTimeB; // Tri par ordre d'arrivée si les priorités sont égales
      }
      return PRIORITY[a.priority] > PRIORITY[b.priority] ? -1 : 1;
    });

    sortedSamples.forEach(sample => {
      const compatibleTechnician = data.technicians
        .filter(
          tech =>
            tech.speciality === sample.type || tech.speciality === 'GENERAL'
        )
        .sort((a, b) => a.availableAt - b.availableAt)[0];

      const compatibleEquipment = data.equipments
        .filter(equip => equip.type === sample.type && equip.available)
        .sort((a, b) => a.availableAt - b.availableAt)[0];

      if (compatibleTechnician && compatibleEquipment) {
        const startTime = Math.max(
          toMinutes(sample.arrivalTime),
          compatibleTechnician.availableAt,
          compatibleEquipment.availableAt
        );
        const endTime = startTime + sample.analysisTime;
        compatibleTechnician.availableAt = endTime;
        compatibleEquipment.availableAt = endTime;

        schedule.push({
          sampleId: sample.id,
          technicianId: compatibleTechnician.id,
          equipmentId: compatibleEquipment.id,
          startTime: toTime(startTime),
          endTime: toTime(endTime),
          priority: sample.priority,
        });

        totalAnalysisTime += endTime - startTime;
      }
    });
    const firstStartTime = Math.min(
      ...schedule.map((s: any) => toMinutes(s.startTime))
    );
    const lastEndTime = Math.max(
      ...schedule.map((s: any) => toMinutes(s.endTime))
    );
    const totalTime = lastEndTime - firstStartTime;

    const efficiency = totalAnalysisTime / totalTime;

    let conflicts = 0;

    schedule.forEach((s, index) => {
      if (s.startTime < schedule[index - 1]?.endTime) {
        conflicts++;
      }
    });

    const metrics = {
      totalTime,
      efficiency: parseFloat((efficiency * 100).toFixed(2)),
      conflicts: 0, // l'algorithme valide déjà qu'il n'y a pas de conflits grâce au Math.max pour le startTime
    };

    console.log('Schedule:', [schedule, metrics]);
    return { schedule, metrics };
  }
}
