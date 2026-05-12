import { Equipment } from '../models/Equipment';
import { Sample } from '../models/Sample';
import { Technician } from '../models/Technician';

// ─── Échantillons ────────────────────────────────────────────────────────────

export const samples: Sample[] = [
  // STAT (4)
  new Sample('S001', 'BLOOD', 'STAT', 45, '08:30', 'Numération complète', {
    age: 67,
    service: 'Urgences',
    diagnosis: 'Suspicion hémorragie',
  }),
  new Sample('S008', 'BLOOD', 'STAT', 30, '09:15', 'Troponine', {
    age: 55,
    service: 'Cardiologie',
    diagnosis: 'Infarctus suspecté',
  }),
  new Sample('S012', 'BLOOD', 'STAT', 60, '10:45', 'Hémoculture urgente', {
    age: 34,
    service: 'Réanimation',
    diagnosis: 'Sepsis sévère',
  }),
  new Sample('S017', 'BLOOD', 'STAT', 40, '13:20', 'Allergènes critiques', {
    age: 8,
    service: 'Pédiatrie',
    diagnosis: 'Choc anaphylactique',
  }),

  // URGENT (8)
  new Sample('S002', 'BLOOD', 'URGENT', 35, '08:45', 'Bilan hépatique', {
    age: 42,
    service: 'Gastroentérologie',
    diagnosis: 'Hépatite virale',
  }),
  new Sample('S005', 'BLOOD', 'URGENT', 25, '09:30', 'Coagulation', {
    age: 73,
    service: 'Chirurgie',
    diagnosis: 'Pré-opératoire',
  }),
  new Sample('S009', 'URINE', 'URGENT', 50, '10:15', 'ECBU', {
    age: 29,
    service: 'Urologie',
    diagnosis: 'Infection urinaire',
  }),
  new Sample('S011', 'BLOOD', 'URGENT', 90, '11:00', 'Caryotype urgent', {
    age: 32,
    service: 'Génétique médicale',
    diagnosis: 'Syndrome chromosomique',
  }),
  new Sample('S014', 'BLOOD', 'URGENT', 55, '11:45', 'Sérologie HIV', {
    age: 26,
    service: 'Infectiologie',
    diagnosis: 'Exposition VIH',
  }),
  new Sample('S016', 'BLOOD', 'URGENT', 40, '12:30', 'Frottis sanguin', {
    age: 45,
    service: 'Hématologie',
    diagnosis: 'Leucémie suspectée',
  }),
  new Sample('S018', 'BLOOD', 'URGENT', 20, '14:15', 'Électrolytes', {
    age: 81,
    service: 'Gériatrie',
    diagnosis: 'Déshydratation',
  }),
  new Sample('S020', 'TISSUE', 'URGENT', 65, '15:30', 'Parasitologie', {
    age: 12,
    service: 'Pédiatrie',
    diagnosis: 'Parasitose intestinale',
  }),

  // ROUTINE (8)
  new Sample('S003', 'BLOOD', 'ROUTINE', 30, '09:00', 'Bilan lipidique', {
    age: 58,
    service: 'Médecine générale',
    diagnosis: 'Contrôle cholestérol',
  }),
  new Sample('S004', 'BLOOD', 'ROUTINE', 25, '09:15', 'Hémogramme standard', {
    age: 35,
    service: 'Médecine du travail',
    diagnosis: 'Visite systématique',
  }),
  new Sample('S006', 'BLOOD', 'ROUTINE', 35, '10:00', 'Vaccination contrôle', {
    age: 22,
    service: 'Médecine préventive',
    diagnosis: 'Titre anticorps',
  }),
  new Sample('S007', 'BLOOD', 'ROUTINE', 120, '10:30', 'Conseil génétique', {
    age: 28,
    service: 'Consultation génétique',
    diagnosis: 'Antécédents familiaux',
  }),
  new Sample('S010', 'TISSUE', 'ROUTINE', 45, '11:15', 'Prélèvement gorge', {
    age: 19,
    service: 'ORL',
    diagnosis: 'Angine récidivante',
  }),
  new Sample('S013', 'BLOOD', 'ROUTINE', 25, '12:00', 'HbA1c', {
    age: 52,
    service: 'Endocrinologie',
    diagnosis: 'Diabète type 2',
  }),
  new Sample('S015', 'BLOOD', 'ROUTINE', 60, '13:00', 'Vitesse sédimentation', {
    age: 65,
    service: 'Rhumatologie',
    diagnosis: 'Inflammation chronique',
  }),
  new Sample('S019', 'BLOOD', 'ROUTINE', 90, '14:45', 'Pharmacogénétique', {
    age: 47,
    service: 'Oncologie',
    diagnosis: 'Adaptation thérapie',
  }),
];

// ─── Techniciens ─────────────────────────────────────────────────────────────

export const technicians: Technician[] = [
  new Technician(
    'TECH001',
    'Dr. Marie Dubois',
    ['BLOOD', 'CHEMISTRY'],
    1.2,
    '07:30',
    '16:30',
    '12:30-13:30'
  ),
  new Technician(
    'TECH002',
    'Jean-Pierre Martin',
    ['MICROBIOLOGY', 'IMMUNOLOGY'],
    1.1,
    '08:00',
    '17:00',
    '13:00-14:00'
  ),
  new Technician(
    'TECH003',
    'Sophie Bernard',
    ['CHEMISTRY', 'IMMUNOLOGY'],
    1.0,
    '08:00',
    '17:00',
    '12:00-13:00'
  ),
  new Technician(
    'TECH004',
    'Lucas Petit',
    ['BLOOD', 'GENETICS'],
    0.95,
    '09:00',
    '18:00',
    '13:00-14:00'
  ),
  new Technician(
    'TECH005',
    'Emma Rousseau',
    ['MICROBIOLOGY'],
    1.0,
    '07:00',
    '16:00',
    '12:30-13:30'
  ),
  new Technician(
    'TECH006',
    'Thomas Moreau',
    ['GENETICS', 'IMMUNOLOGY'],
    0.9,
    '09:30',
    '18:30',
    '13:30-14:30'
  ),
  new Technician(
    'TECH007',
    'Camille Leroy',
    ['CHEMISTRY', 'BLOOD', 'IMMUNOLOGY'],
    1.05,
    '08:30',
    '17:30',
    '12:00-13:00'
  ),
  new Technician(
    'TECH008',
    'Antoine Garnier',
    ['BLOOD', 'MICROBIOLOGY'],
    0.85,
    '10:00',
    '19:00',
    '14:00-15:00'
  ),
];

// ─── Équipements ─────────────────────────────────────────────────────────────

export const equipments: Equipment[] = [
  new Equipment(
    'EQ001',
    'Analyseur Hématologie XN-3000',
    'BLOOD',
    ['Hémogramme', 'Numération', 'Coagulation', 'Frottis'],
    2,
    '06:00-07:00',
    10
  ),
  new Equipment(
    'EQ002',
    'Automate Biochimie Cobas 8000',
    'CHEMISTRY',
    ['Bilan hépatique', 'Lipides', 'Électrolytes', 'Troponine', 'HbA1c'],
    3,
    '06:30-07:30',
    15
  ),
  new Equipment(
    'EQ003',
    'Station Microbiologie Vitek MS',
    'MICROBIOLOGY',
    ['ECBU', 'Hémoculture', 'Parasitologie', 'Prélèvement gorge'],
    2,
    '07:00-08:00',
    20
  ),
  new Equipment(
    'EQ004',
    'Système Immunologie Liaison XL',
    'IMMUNOLOGY',
    ['Sérologie', 'Allergènes', 'Vaccination', 'Titre anticorps'],
    2,
    '05:30-06:30',
    12
  ),
  new Equipment(
    'EQ005',
    'Séquenceur Génétique NextSeq',
    'GENETICS',
    ['Caryotype', 'Conseil génétique', 'Pharmacogénétique'],
    1,
    '19:00-20:00',
    30
  ),
];
