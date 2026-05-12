export class Equipment {
    private _availableAt: number;
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly type: 'BLOOD' | 'URINE' | 'TISSUE',
        public readonly available: boolean
    ){
        this._availableAt = this.available ? 0 : Infinity; // If equipment is available, it can be used immediately, otherwise it's not available at all
    }

    public get availableAt(): number {
        return this._availableAt;
    }

    public set availableAt(time: number) {
        this._availableAt = time;
    }
}