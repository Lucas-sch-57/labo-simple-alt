import { toMinutes } from "../../utils/time";

export class Technician {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly speciality: 'BLOOD' | 'URINE' | 'TISSUE' | 'GENERAL',
        public readonly startTime: string,
        public readonly endTime: string,
    ){
        this.availableAt = toMinutes(startTime);
    }

    public get availableAt(): number {
        return this.availableAt;
    }

    public set availableAt(time: number) {
        this.availableAt = time;
    }
}