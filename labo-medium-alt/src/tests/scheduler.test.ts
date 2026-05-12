import { describe, it, expect } from 'vitest';
import { Scheduler } from '../services/Scheduler';
import { Sample } from '../models/Sample';
import { Technician } from '../models/Technician';
import { Equipment } from '../models/Equipment';

const scheduler = new Scheduler();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeSample = (
  id: string,
  priority: 'STAT' | 'URGENT' | 'ROUTINE',
  analysisType: string,
  analysisTime: number,
  arrivalTime: string
) =>
  new Sample(id, 'BLOOD', priority, analysisTime, arrivalTime, analysisType, {
    age: 30,
    service: 'Test',
    diagnosis: 'Test',
  });

const makeTech = (
  id: string,
  specialty: string[],
  efficiency = 1.0,
  lunchBreak = '12:00-13:00'
) =>
  new Technician(
    id,
    'Test Tech',
    specialty,
    efficiency,
    '08:00',
    '17:00',
    lunchBreak
  );

const makeEquip = (id: string, type: string, compatibleTypes: string[]) =>
  new Equipment(id, 'Test Equip', type, compatibleTypes, 1, '06:00-07:00', 0);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Scheduler', () => {
  it('happy path — planifie un seul échantillon', () => {
    const data = {
      samples: [makeSample('S001', 'URGENT', 'Coagulation', 30, '09:00')],
      technicians: [makeTech('T001', ['BLOOD'])],
      equipments: [makeEquip('E001', 'BLOOD', ['Coagulation'])],
    };

    const result = scheduler.planifyLab(data);

    expect(result.schedule).toHaveLength(1);
    expect(result.schedule[0].sampleId).toBe('S001');
    expect(result.schedule[0].startTime).toBe('09:00');
    expect(result.schedule[0].endTime).toBe('09:30');
    expect(result.metrics.conflicts).toBe(0);
  });

  it('priorités — STAT passe avant URGENT', () => {
    const data = {
      samples: [
        makeSample('S001', 'URGENT', 'Coagulation', 45, '09:00'),
        makeSample('S002', 'STAT', 'Coagulation', 20, '09:30'),
      ],
      technicians: [makeTech('T001', ['BLOOD'])],
      equipments: [makeEquip('E001', 'BLOOD', ['Coagulation'])],
    };

    const result = scheduler.planifyLab(data);

    expect(result.schedule[0].sampleId).toBe('S002');
    expect(result.schedule[0].priority).toBe('STAT');
    expect(result.schedule[1].sampleId).toBe('S001');
    expect(result.schedule[1].priority).toBe('URGENT');
  });

  it('spécialisations — assigne uniquement un technicien compatible', () => {
    const data = {
      samples: [makeSample('S001', 'URGENT', 'ECBU', 30, '09:00')],
      technicians: [
        makeTech('T001', ['BLOOD']),
        makeTech('T002', ['MICROBIOLOGY']),
      ],
      equipments: [makeEquip('E001', 'MICROBIOLOGY', ['ECBU'])],
    };

    const result = scheduler.planifyLab(data);

    expect(result.schedule).toHaveLength(1);
    expect(result.schedule[0].technicianId).toBe('T002');
  });

  it("pause déjeuner — décale l'analyse après la pause", () => {
    const data = {
      samples: [makeSample('S001', 'ROUTINE', 'Coagulation', 30, '11:50')],
      technicians: [makeTech('T001', ['BLOOD'], 1.0, '12:00-13:00')],
      equipments: [makeEquip('E001', 'BLOOD', ['Coagulation'])],
    };

    const result = scheduler.planifyLab(data);

    expect(result.schedule[0].startTime).toBe('13:00');
    expect(result.schedule[0].endTime).toBe('13:30');
  });

  it("coefficient d'efficacité", () => {
    const data = {
      samples: [makeSample('S001', 'URGENT', 'Coagulation', 60, '09:00')],
      technicians: [makeTech('T001', ['BLOOD'], 1.2)],
      equipments: [makeEquip('E001', 'BLOOD', ['Coagulation'])],
    };

    const result = scheduler.planifyLab(data);

    expect(result.schedule[0].duration).toBe(50);
    expect(result.schedule[0].endTime).toBe('09:50');
  });
});
