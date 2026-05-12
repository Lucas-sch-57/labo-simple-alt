export class Equipment {
  private _availableAt: number;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
    public readonly compatibleTypes: string[],
    public readonly capacity: number,
    public readonly maintenanceWindow: string,
    public readonly cleaningTime: number
  ) {
    this._availableAt = 0;
  }

  public get availableAt(): number {
    return this._availableAt;
  }

  public set availableAt(time: number) {
    this._availableAt = time;
  }
}
