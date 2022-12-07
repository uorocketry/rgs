
import { Server } from "socket.io";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3500");

socket.on("connect", () => {
    console.log("Connected to proxy server");
    socket.emit("meta");
});

socket.on("meta", (keys) => {
    console.log("Got meta", keys);
});




setTimeout(() => {
    console.log("Sending ping");
    let start = Date.now();
    socket.emit("ping", () => {
        console.log("Latency(ms): ", Date.now() - start);
    });
}, 1000);

socket.emit("create_room", "test");
socket.emit("put", "test", 23, "value");
socket.emit("put", "test", 24, "value24");
socket.emit("put", "test", 25, "value25");
socket.emit("put", "test", 26, "value26");

socket.emit("get", "test", 24, 26, (data: any[]) => {
    console.log("Got data", data);
});

socket.emit("meta", (data: any) => {
    console.log("Got meta", data);
});


// server.listen(3000);