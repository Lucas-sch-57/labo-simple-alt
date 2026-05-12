import { toMinutes } from '../utils/time';

export class Technician {
  private _availableAt: number;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly specialty: string[],
    public readonly efficiency: number,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly lunchBreak: string
  ) {
    this._availableAt = toMinutes(startTime);
  }

  public get availableAt(): number {
    return this._availableAt;
  }

  public set availableAt(time: number) {
    this._availableAt = time;
  }
}
