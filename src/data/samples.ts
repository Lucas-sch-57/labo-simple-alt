import { Equipment } from '../models/Equipment';
import { Sample } from '../models/Sample';
import { Technician } from '../models/Technician';

// ─── Exemple 1 : Un seul échantillon ────────────────────────────────────────
// Cas le plus simple : 1 sample, 1 technicien, 1 équipement
export const example1 = {
  samples: [new Sample('S001', 'BLOOD', 'URGENT', 30, '09:00', 'P001')],
  technicians: [
    new Technician('T001', 'Alice Martin', 'BLOOD', '08:00', '17:00'),
  ],
  equipments: [new Equipment('E001', 'Analyseur Sang A', 'BLOOD', true)],
};

// ─── Exemple 2 : Priorités STAT vs URGENT ───────────────────────────────────
// URGENT arrive avant STAT mais STAT doit passer en premier
export const example2 = {
  samples: [
    new Sample('S001', 'BLOOD', 'URGENT', 45, '09:00', 'P001'), // arrive avant
    new Sample('S002', 'BLOOD', 'STAT', 30, '09:30', 'P002'), // arrive après mais prioritaire
  ],
  technicians: [
    new Technician('T001', 'Alice Martin', 'BLOOD', '08:00', '17:00'),
  ],
  equipments: [new Equipment('E001', 'Analyseur Sang A', 'BLOOD', true)],
};

// ─── Exemple 3 : Ressources multiples + parallélisme ────────────────────────
// Plusieurs types d'échantillons, technicien GENERAL, analyses en parallèle
export const example3 = {
  samples: [
    new Sample('S001', 'BLOOD', 'URGENT', 60, '09:00', 'P001'),
    new Sample('S002', 'URINE', 'URGENT', 30, '09:15', 'P002'),
    new Sample('S003', 'BLOOD', 'ROUTINE', 45, '09:00', 'P003'),
  ],
  technicians: [
    new Technician('T001', 'Alice Martin', 'BLOOD', '08:00', '17:00'),
    new Technician('T002', 'Bob Dupont', 'GENERAL', '08:00', '17:00'),
  ],
  equipments: [
    new Equipment('E001', 'Analyseur Sang A', 'BLOOD', true),
    new Equipment('E002', 'Analyseur Urine B', 'URINE', true),
  ],
};

// ─── Exemple 4 : Les 3 priorités + conflit de ressources ────────────────────
// STAT, URGENT et ROUTINE en compétition sur les mêmes ressources
export const example4 = {
  samples: [
    new Sample('S001', 'BLOOD', 'ROUTINE', 30, '08:00', 'P001'),
    new Sample('S002', 'BLOOD', 'URGENT', 45, '08:00', 'P002'),
    new Sample('S003', 'BLOOD', 'STAT', 20, '08:00', 'P003'),
    new Sample('S004', 'BLOOD', 'URGENT', 30, '08:30', 'P004'),
  ],
  technicians: [
    new Technician('T001', 'Alice Martin', 'BLOOD', '08:00', '17:00'),
  ],
  equipments: [new Equipment('E001', 'Analyseur Sang A', 'BLOOD', true)],
};

// ─── Exemple 5 : Équipement indisponible au départ ──────────────────────────
// Teste la gestion de available=false
export const example5 = {
  samples: [
    new Sample('S001', 'BLOOD', 'STAT', 30, '09:00', 'P001'),
    new Sample('S002', 'BLOOD', 'URGENT', 45, '09:00', 'P002'),
  ],
  technicians: [
    new Technician('T001', 'Alice Martin', 'BLOOD', '08:00', '17:00'),
    new Technician('T002', 'Bob Dupont', 'BLOOD', '08:00', '17:00'),
  ],
  equipments: [
    new Equipment('E001', 'Analyseur Sang A', 'BLOOD', false), // indisponible
    new Equipment('E002', 'Analyseur Sang B', 'BLOOD', true),
  ],
};
