
import { Server, Socket } from "socket.io";
import { connect } from 'amqplib';
import { program } from 'commander';
import { InfluxDB, Point, HttpError, FluxTableMetaData } from '@influxdata/influxdb-client'

import {
    AuthorizationsAPI,
    OrgsAPI,
    SigninAPI,
    SignoutAPI,
} from '@influxdata/influxdb-client-apis'


// Arguments:
// --port: Port to run the server on
// --log: Log level (default: info)
program
    .option('-p, --port <port>', 'Port to run the server on', '3500')
    .option('-l, --log <log>', 'Minimum Log level (off, error, warn, log, all)', 'all')

program.parse();

const options = program.opts();

const PORT = options['port'];
const LOG_LEVEL = options['log'];

if (LOG_LEVEL === "off") {
    console.log = () => { };
    console.warn = () => { };
    console.error = () => { };
} else if (LOG_LEVEL === "error") {
    console.log = () => { };
    console.warn = () => { };
} else if (LOG_LEVEL === "warn") {
    console.log = () => { };
}


// Warning!
// If you are having trouble accessing your local server from production, make sure to "allow insecure localhost" in your browser.
// chrome://flags/#allow-insecure-localhost

// Initialize the server
import { createServer } from 'http';
import { env } from 'process';
import { TimeSeries } from "./TimeSeries";
import { time } from "console";
import { Room } from "./Room";




const influxClientOpts: any = {
    url: 'http://localhost:8086',
    timeout: 1 * 1000, // 1 seconds
    org: 'uorocketry',
    token: 'uorocketry',
}
const influx = new InfluxDB(influxClientOpts)


const writeApi = influx.getWriteApi(influxClientOpts.org, 'default', 'ns')
// setup default tags for all writes through this API


let rec = {
    lat: 1,
    lon: 2,
    speed: {
        x: 1,
        y: 2,
        z: 3
    },
    extra: "This could be a flatbuffer or protobuf or something"
}
console.log(JSON.stringify(rec))
let b64 = Buffer.from(JSON.stringify(rec)).toString('base64')

let p = new Point("imu")
    .stringField("buffer", b64)
    .stringField("type", "application/json+base64")

writeApi.writePoint(p)

let now = new Date()
let cntr = 0
console.log("Writting 200 points")
// write point with a custom timestamp
for (let i = 0; i < 200; i++) {
    let i_hours_ago = new Date(now.getTime() - 1000 * 60 * 60 * i)
    let point = new Point('counter')
        .floatField('value', cntr++)
        .timestamp(i_hours_ago)
    writeApi.writePoint(point)

    // console.log("Wrote point: ", cntr)
}



writeApi.flush()
console.log('Finished flushing')

setTimeout(function () {
    console.log("Running queries")

    const queryApi = influx.getQueryApi(influxClientOpts.org)
    // query all data from the bucket
    const fluxQuery =
        `from(bucket:"default") |> range(start: -100y)`

    // query the imu data points
    const fluxQuery2 =
        `from(bucket:"default") |> range(start: -100y) |> filter(fn: (r) => r._measurement == "imu")`


    // Execute query and return the whole result as a string.
    // Use with caution, it copies the whole stream of results into memory.
    async function queryRaw(q: string) {
        const result = await queryApi.queryRaw(q)
        console.log(result)
        console.log('\nQueryRaw SUCCESS')
    }

    console.log("Querying IMU entires")
    queryApi.queryRows(fluxQuery2, {
        next: (row: string[], tableMeta: FluxTableMetaData) => {
            // the following line creates an object for each row
            const o = tableMeta.toObject(row)
            console.log(JSON.stringify(o, null, 2))
            console.log()
        },
        error: (error: Error) => {
            console.error(error)
            console.log('\nQueryRows ERROR')
        },
        complete: () => {
            console.log('\nQueryRows SUCCESS')
        },
    })


    // queryRaw(q)
    // queryRaw(fluxQuery2)

}, 3000);


// const server = createServer();

// const io = new Server(server, {
//     cors: {
//         origin: '*',
//     },
// });


// console.log("Server started on port " + PORT);

// let clientSettings = new Map<[string, string], Map<string, any>>();

// let rooms = new Map<string, Room>();

// io.on('connection', (socket) => {
//     console.log('CONNECTED(' + socket.id + ')');

//     socket.on('ping', (callback) => {
//         console.log('PING(' + socket.id + ')');
//         callback();
//     });

//     socket.on('disconnect', (reason) => {
//         console.log('DISCONNECT(' + socket.id + '):', reason);
//     });

//     socket.on('create_room', (roomName) => {
//         console.log('CREATE_ROOM(' + socket.id + '):', roomName);
//         rooms.set(roomName, new Room(roomName, io));
//     });

//     socket.on('delete_room', (roomName) => {
//         console.log('DELETE_ROOM(' + socket.id + '):', roomName);
//         rooms.delete(roomName);
//     });

//     socket.on('put', (roomName, key, value) => {
//         console.log('PUT(' + socket.id + '):', roomName, key, value);
//         rooms.get(roomName).put(key, value);
//     });

//     socket.on('get', (roomName, a, b, callback) => {
//         // If only "a" is provided, return the value at that key
//         // If "a" and "b" are provided, return time series data between those two timestamps
//         if (callback) {
//             callback(rooms.get(roomName).get(a, b));
//         }
//     });

//     socket.on('meta', (callback) => {
//         console.log('META(' + socket.id + ')');
//         let ret: any = {};
//         rooms.forEach((room, key) => {
//             ret[key] = {
//                 length: room.lenght(),
//                 type: room.roomType()
//             }
//             if (room.roomType() === "series") {
//                 ret[key].min = room.range[0];
//                 ret[key].max = room.range[1];
//             }
//         });
//         // Room name, lenght, range, type
//         if (callback) {
//             callback(ret);
//         }
//     });


//     // socket.on("meta", async () => {
//     //     let ret = new Map<string, string>();
//     //     rooms.forEach((room, key) => {
//     //         ret.set(key, room.roomType);
//     //     });
//     //     console.log(rooms.get("vars").roomType);
//     //     socket.emit("meta", typeof rooms.get("vars"));
//     //     console.log("Sending", keysInData);
//     // });

//     // subscribe to room
//     socket.on("join", (room) => {
//         socket.join(room);
//     });

//     // subscribe to room
//     socket.on("leave", (room) => {
//         socket.leave(room);
//     });
// });




// server.listen(PORT);