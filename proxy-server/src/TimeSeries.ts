



export class TimeSeries {
    values: [number, any][] = []; // [timestamp, value]

    // Given a timestamp, return the index of the first value with a timestamp greater than or equal to the given timestamp.
    findMinTimeStampIndex(timestamp: number): number {
        let left = 0;
        let right = this.values.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.values[mid][0] >= timestamp) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        if (left >= this.values.length) {
            return -1;
        }
        return left;
    }

    findMaxTimeStampIndex(timestamp: number): number {
        let left = 0;
        let right = this.values.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.values[mid][0] <= timestamp) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        if (right < 0) {
            return -1;
        }
        return right;
    }

    getRange(leftTimestamp: number, rightTimestamp: number): [number, number] {
        return [this.findMinTimeStampIndex(leftTimestamp), this.findMaxTimeStampIndex(rightTimestamp)];
    }

}

