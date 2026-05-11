import { Sample } from "../models/Sample";
import { Technician } from "../models/Technician";
import { Equipment } from "../models/Equipment";
export interface Data {
    samples: Sample[]
    technicians: Technician[]
    equipments: Equipment[]
}