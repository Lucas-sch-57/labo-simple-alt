import {
  example1,
  example2,
  example3,
  example4,
  example5,
} from './data/samples';
import { Scheduler } from './services/Scheduler';

const scheduler = new Scheduler();
scheduler.planifyLab(example3);
