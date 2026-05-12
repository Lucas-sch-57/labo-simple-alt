import {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
} from './data/samples';
import { Scheduler } from './services/Scheduler';
import { Schedule, ScheduleResult } from './types/schedule';

const scheduler = new Scheduler();

const examples = [
  { label: 'Exemple 1 — Un seul échantillon', data: example1 },
  { label: 'Exemple 2 — Priorités STAT vs URGENT', data: example2 },
  { label: 'Exemple 3 — Ressources multiples', data: example3 },
  { label: 'Exemple 4 — Les 3 priorités en compétition', data: example4 },
  { label: 'Exemple 5 — Équipement indisponible', data: example5 },
  { label: 'Exemple 6 — Échantillon arrive plus tard', data: example6 },
];

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

const PRIORITY_COLOR: Record<string, string> = {
  STAT: RED,
  URGENT: YELLOW,
  ROUTINE: GREEN,
};

function printSeparator(char = '─', length = 60): void {
  console.log(char.repeat(length));
}

function printEntry(entry: Schedule, index: number): void {
  const color = PRIORITY_COLOR[entry.priority] ?? RESET;
  console.log(
    `  ${index + 1}. ${color}[${entry.priority}]${RESET}` +
      ` Sample ${entry.sampleId}` +
      ` → Tech ${entry.technicianId} + Equip ${entry.equipmentId}` +
      ` | ${entry.startTime} → ${entry.endTime}`
  );
}

function printResult(label: string, result: ScheduleResult): void {
  printSeparator('═');
  console.log(`  ${label}`);
  printSeparator();

  console.log('  Planning :');
  result.schedule.forEach((entry, i) => printEntry(entry, i));

  printSeparator();
  console.log('  Métriques :');
  console.log(`  Temps total  : ${result.metrics.totalTime} min`);
  console.log(`  Efficacité   : ${result.metrics.efficiency} %`);
  console.log(
    `  Conflits     : ${result.metrics.conflicts === 0 ? `${GREEN}0 ✓${RESET}` : `${RED}${result.metrics.conflicts} ✗${RESET}`}`
  );
  console.log();
}

examples.forEach(({ label, data }) => {
  const result = scheduler.planifyLab(data);
  printResult(label, result);
});
