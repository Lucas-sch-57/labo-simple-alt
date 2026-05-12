# 🏥 Lab Planner — Système de Planification Laboratoire Médical

## Description

Système de planification intelligente pour laboratoire médical. La fonction `planifyLab(data)` reçoit une liste d'échantillons, de techniciens et d'équipements, et produit un planning avec des métriques.

Les échantillons sont priorisés :
```
STAT (urgence vitale) > URGENT (important) > ROUTINE (standard)
```

## Installation

**Prérequis** : Node.js, pnpm

```bash
pnpm install
```

## Utilisation

```bash
# Lancer le planning
pnpm start

# Lancer les tests
pnpm test
```

## Structure du Projet

```
src/
├── models/
│   ├── Sample.ts         
│   ├── Technician.ts      
│   └── Equipment.ts       
├── services/
│   └── Scheduler.ts       
├── constants/
│   ├── priority.ts        
│   └── analysis-to-specialty.ts  
├── utils/
│   ├── time.ts           
│   └── average.ts         
├── data/
│   └── samples.ts         
├── tests/
│   └── scheduler.test.ts 
└── index.ts               
```

## Format des Données

### Input

```typescript
{
  samples: Sample[],        
  technicians: Technician[], 
  equipments: Equipment[]   
}
```

### Output

```typescript
{
  schedule: ScheduleEntry[], 
  metrics: {
    totalTime: number,               
    efficiency: number,             
    conflicts: number,               
    technicianUtilization: number,   
    averageWaitTimePerPriority: { 
      STAT: number,
      URGENT: number,
      ROUTINE: number
    }
  }
}
```

## Algorithme

**Étape 1 — Tri par priorité** : STAT > URGENT > ROUTINE, puis par heure d'arrivée à priorité égale.

**Étape 2 — Assignation des ressources** : pour chaque échantillon, sélection du technicien compatible (spécialité via `analysisType`) et de l'équipement compatible, tous deux les plus tôt disponibles.

**Étape 3 — Calcul du créneau** :
```
startTime = max(arrivalTime, tech.availableAt, equip.availableAt)
```
Avec décalage si chevauchement avec la pause déjeuner du technicien ou la fenêtre de maintenance de l'équipement.

**Étape 4 — Métriques** : calculées après planification complète.

## Contraintes Implémentées

| Contrainte | Description |
| Priorité | STAT toujours traité en premier |
| Spécialisations | Technicien assigné selon `analysisType` |
| Coefficient d'efficacité | `durée réelle = Math.round(analysisTime / efficiency)` |
| Pause déjeuner | Analyse décalée après la pause si chevauchement |
| Maintenance équipement | Analyse décalée après maintenance si chevauchement |
| Temps de nettoyage | Ajouté à `equipment.availableAt` après chaque analyse |
| Parallélisme | Analyses simultanées sur ressources différentes |

## Évolution depuis Version Simple

| Fonctionnalité | Simple | Intermédiaire |
| Tri par priorité | Oui | Oui |
| Parallélisme | Oui | Oui |
| `analysisType` | Non | Oui |
| Coefficient d'efficacité | Non | Oui |
| Pause déjeuner | Non | Oui |
| Maintenance équipement | Non | Oui |
| Temps de nettoyage | Non | Oui |
| Métriques avancées | Non | Oui |

## Tests

```bash
pnpm test
```

5 tests couvrant :
- Happy path
- Respect des priorités STAT > URGENT > ROUTINE
- Spécialisations
- Gestion des pauses déjeuner
- Application du coefficient d'efficacité