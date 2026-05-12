import { equipments } from '../data/samples';

const ANALYSIS_TO_SPECIALTY: Record<string, string> = {};
equipments.forEach(eq => {
  eq.compatibleTypes.forEach(type => {
    ANALYSIS_TO_SPECIALTY[type] = eq.type;
  });
});
