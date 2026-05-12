import { samples, technicians, equipments } from './data/samples';
import { Scheduler } from './services/Scheduler';
import { Schedule, ScheduleResult } from './types/schedule';

const scheduler = new Scheduler();

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
  console.log(`  Utilisation   : ${result.metrics.technicianUtilization} %`);
  console.log(
    `  Attente STAT : ${result.metrics.averageWaitTimePerPriority.STAT} min`
  );
  console.log(
    `  Attente URGENT : ${result.metrics.averageWaitTimePerPriority.URGENT} min`
  );
  console.log(
    `  Attente ROUTINE : ${result.metrics.averageWaitTimePerPriority.ROUTINE} min`
  );
  console.log(
    `  Conflits     : ${result.metrics.conflicts === 0 ? `${GREEN}0 ✓${RESET}` : `${RED}${result.metrics.conflicts} ✗${RESET}`}`
  );
  console.log();
}

const result = scheduler.planifyLab({ samples, technicians, equipments });
printResult('Laboratoire Central — 20 échantillons / 8 techniciens', result);
