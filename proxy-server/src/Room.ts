import { Server, Socket } from "socket.io";

export class Room {
    public data: Map<string, any> | [number, number][] = new Map();
    public range: [number, number] = [Number.MAX_VALUE, Number.MIN_VALUE];

    constructor(public roomName: string, public io: Server) {
    }

    lenght() {
        if (this.data instanceof Map) {
            return this.data.size;
        } else {
            return this.data.length;
        }
    }

    roomType() {
        if (this.data instanceof Map) {
            if (this.data.size == 0) {
                return "unknown";
            }
            return "map";
        } else {
            if (this.data.length == 0) {
                return "unknown";
            }
            return "series";
        }
    }

    // Given a timestamp, return the index of the first value with a timestamp greater than or equal to the given timestamp.
    findMinTimeStampIndex(timestamp: number): number {
        this.data = this.data as [number, number][];

        let left = 0;
        let right = this.data.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.data[mid][0] >= timestamp) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        if (left >= this.data.length) {
            return -1;
        }
        return left;
    }

    findMaxTimeStampIndex(timestamp: number): number {
        this.data = this.data as [number, number][];

        let left = 0;
        let right = this.data.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.data[mid][0] <= timestamp) {
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

    get(a: any, b: any) {
        if (this.data instanceof Map) {
            return this.data.get(a);
        } else {
            return this.getRange(a, b);
        }
    }

    getRange(leftTimestamp: number, rightTimestamp: number) {
        if (this.data instanceof Map) {
            console.warn("fetchRange called on a non-timeseries room");
            return [-1, -1, []];
        }

        const [left, right] = [this.findMinTimeStampIndex(leftTimestamp), this.findMaxTimeStampIndex(rightTimestamp)];
        if (left === -1 || right === -1) {
            return [-1, -1, []];
        }
        return [left, right, this.data.slice(left, right + 1)]
    }

    join(_: Socket) {
        // this.variables.forEach((value, key) => {
        // socket.emit("put", key, value);
        // });
    }

    leave(_: Socket) {
        // Nothing to do
    }

    put(key: any, value: any) {
        if (this.data instanceof Map) {
            // If value is number and lenght is 0, make this.variables an array
            if (typeof key === "number" && this.data.size === 0) {
                this.data = [];
                console.log("Converting room " + this.roomName + " to a time series array")
            }
        }


        if (this.data instanceof Array) {
            this.data.push([key, value]);
        } else {
            this.data.set(key, value);
        }

        try {
            this.range = [Math.min(this.range[0], key), Math.max(this.range[1], key)];
        } catch (error) {
            // This might happen but it's fine
        }

        this.io.to(this.roomName).emit("put", key, value);
    }

    delete(key: any) {
        if (this.data instanceof Array) {
            console.warn("Attempting to delete from a time series array!!!")
            return;
        } else {
            this.data.delete(key);
        }

        this.io.to(this.roomName).emit("delete", key);
    }
}