    /**
     * Convert a time string in format HH:MM to a number of minutes since midnight
     * @param time - The time string in format HH:MM
     * @returns The number of minutes since midnight represented by the time string 
     */
    export function toMinutes(time: string): number {
        const [hours, minutes] = time.split(':')
        const result = parseInt(hours) * 60 + parseInt(minutes);
        if (isNaN(result)) {
            throw new Error(`Invalid time format: ${time}`);
        }
        return result;
    }

    /**
     * Convert minutes number to a time string in format HH:MM
     * @param minutes - Number of minutes since midnight
     * @returns The time string in format HH:MM
     */
    export function toTime(minutes: number): string {
        const hours = Math.floor(minutes/60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }