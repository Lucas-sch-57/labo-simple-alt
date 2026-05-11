export class Sample {

    constructor(
        public readonly id: string,
        public readonly type: 'BLOOD' | 'URINE' | 'TISSUE',
        public readonly priority: 'STAT' | 'URGENT' | 'ROUTINE',
        public readonly analysisTime: number,
        public readonly arrivalTime: Date,
        public readonly patientId: string
    ) {}

}