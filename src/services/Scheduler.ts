import { Data } from '../types/data';
import { PRIORITY } from '../constants/priority';
import { toMinutes } from '../../utils/time';

export class Scheduler {
  public planifyLab(data: Data): void {
    let schedule = [];
    // STEP 1 : Tri des échantillons par ordre de priorité (ex: urgence, date de réception, etc.)
    const sortedSamples = data.samples.sort((a, b) => {
      if (PRIORITY[a.priority] === PRIORITY[b.priority]) {
        const arrivalTimeA = toMinutes(a.arrivalTime);
        const arrivalTimeB = toMinutes(b.arrivalTime);
        return arrivalTimeA - arrivalTimeB; // Tri par ordre d'arrivée si les priorités sont égales
      }
      return PRIORITY[a.priority] > PRIORITY[b.priority] ? -1 : 1;
    });

    // console.log('Samples triés par priorité : ', sortedSamples);
    //STEP 2 : Compatibilité entre les échantillons les équipements et les techniciens (ex: compétences, disponibilité, etc.)
    const compatibilityAssignments = sortedSamples.map(sample => {});

    console.log(
      'Compatibilité entre échantillons, techniciens et équipements : ',
      compatibilityAssignments
    );
    // STEP 3 : Gestion des crénaux horaires pour éviter les conflits et optimiser l'utilisation des ressources
    // STEP 4 : Génération d'un planning détaillé pour chaque technicien et équipement, avec les tâches à réaliser et les délais associés
  }
}
