
import { Server, Socket } from "socket.io";

import { program } from 'commander';

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

const server = createServer();

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});


console.log("Server started on port " + PORT);

let clientSettings = new Map<[string, string], Map<string, any>>();

let rooms = new Map<string, Room>();

io.on('connection', (socket) => {
    console.log('CONNECTED(' + socket.id + ')');

    socket.on('ping', (callback) => {
        console.log('PING(' + socket.id + ')');
        callback();
    });

    socket.on('disconnect', (reason) => {
        console.log('DISCONNECT(' + socket.id + '):', reason);
    });

    socket.on('create_room', (roomName) => {
        console.log('CREATE_ROOM(' + socket.id + '):', roomName);
        rooms.set(roomName, new Room(roomName, io));
    });

    socket.on('delete_room', (roomName) => {
        console.log('DELETE_ROOM(' + socket.id + '):', roomName);
        rooms.delete(roomName);
    });

    socket.on('put', (roomName, key, value) => {
        console.log('PUT(' + socket.id + '):', roomName, key, value);
        rooms.get(roomName).put(key, value);
    });

    socket.on('get', (roomName, a, b, callback) => {
        // If only "a" is provided, return the value at that key
        // If "a" and "b" are provided, return time series data between those two timestamps
        if (callback) {
            callback(rooms.get(roomName).get(a, b));
        }
    });

    socket.on('meta', (callback) => {
        console.log('META(' + socket.id + ')');
        let ret: any = {};
        rooms.forEach((room, key) => {
            ret[key] = {
                length: room.lenght(),
                type: room.roomType()
            }
            if (room.roomType() === "series") {
                ret[key].min = room.range[0];
                ret[key].max = room.range[1];
            }
        });
        // Room name, lenght, range, type
        if (callback) {
            callback(ret);
        }
    });


    // socket.on("meta", async () => {
    //     let ret = new Map<string, string>();
    //     rooms.forEach((room, key) => {
    //         ret.set(key, room.roomType);
    //     });
    //     console.log(rooms.get("vars").roomType);
    //     socket.emit("meta", typeof rooms.get("vars"));
    //     console.log("Sending", keysInData);
    // });

    // subscribe to room
    socket.on("join", (room) => {
        socket.join(room);
    });

    // subscribe to room
    socket.on("leave", (room) => {
        socket.leave(room);
    });
});




server.listen(PORT);