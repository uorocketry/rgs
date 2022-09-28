
import { Server } from "socket.io";


// Warning!
// If you are having trouble accessing your local server from production, make sure to "allow insecure localhost" in your browser.
// chrome://flags/#allow-insecure-localhost


import { createServer } from 'http';
// import { createServer } from 'https';
// const { readFileSync } = require("fs");
const server = createServer({
    // key: readFileSync('key.pem'),
    // cert: readFileSync('cert.pem')
});

console.log("Starting blob");
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});


console.log("Server started on port 3000");
let data: Map<string, Map<number, number>> = new Map();

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('message', (message) => {
        console.log(message);
    });
    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    socket.on('ping', () => {
        socket.emit('pong');
    });

    socket.on('put', (key, value) => {
        console.log('put', key, value);
        if (!data.has(key)) {
            data.set(key, new Map());
            let keysInData = Array.from(data.keys());
            socket.emit("meta", keysInData);
        } else {
            const timestamp = new Date().getTime();
            data.get(key)?.set(timestamp, value.value);
        }
        io.to(key).emit('put', key, value);
    });

    socket.on('get', (key, filter) => {
        console.log('get', key, filter);
        if (!data.has(key)) {
            data.set(key, new Map());
        }
        let dataset = data.get(key);
        if (filter && dataset) {
            // Filter compromisses of gt and lt for key,key
            const filtered = new Map();
            for (let [timestamp, value] of dataset) {
                if (timestamp > filter.gt && timestamp < filter.lt) {
                    filtered.set(timestamp, value);
                }
            }
            dataset = filtered;
        }
        socket.emit('get', key, dataset);
    });

    socket.on("meta", async () => {
        let keysInData = Array.from(data.keys());
        socket.emit("meta", keysInData);
        console.log("Sending", keysInData);
    });

    // subscribe to room
    socket.on("sub", (room) => {
        socket.join(room);
    });

    // subscribe to room
    socket.on("unsub", (room) => {
        socket.leave(room);
    });
});

// Mock data

// Fake lat and long
data.set("lat", new Map());
data.set("lon", new Map());

// Test three-phase system
data.set("Phase 1", new Map()); // sin(x)
data.set("Phase 2", new Map()); // sin(x + 4/3 * pi)
data.set("Phase 3", new Map()); // sin(x + 2/3 * pi)


let curLat = 34;
let curLon = -105;
setInterval(() => {
    let now = new Date().getTime();
    let deviation = Math.sin(Math.random()) * 0.0005;
    curLat += deviation + 0.0002;
    // Wrap around 90 and -90
    if (curLat > 90) {
        curLat = -90 + (curLat - 90);
    } else if (curLat < -90) {
        curLat = 90 + (curLat + 90);
    }

    io.to("lat").emit('put', "lat", now, curLat);
    deviation = Math.sin(Math.random()) * 0.01;
    curLon += deviation + 0.002;
    // Wrap around -180 and 180
    if (curLon > 180) {
        curLon = -180 + (curLon - 180);
    } else if (curLon < -180) {
        curLon = 180 + (curLon + 180);
    }
    io.to("lon").emit('put', "lon", now, curLon);
}, 200);



setInterval(() => {
    let now = new Date().getTime();
    let x = now / 1000;
    io.to("Phase 1").emit('put', "Phase 1", now, Math.sin(x));
    io.to("Phase 2").emit('put', "Phase 2", now, Math.sin(x + 4 / 3 * Math.PI));
    io.to("Phase 3").emit('put', "Phase 3", now, Math.sin(x + 2 / 3 * Math.PI));
}, 200);

server.listen(3000);