import { Server } from "socket.io";
import zmq from "zeromq";
import type { Server as HTTPServer } from "http";

export const setupServer = (http: HTTPServer) => {
  const PORT = 3002;
  const zmqSock = zmq.socket("sub");
  zmqSock.subscribe("");
  zmqSock.connect("tcp://localhost:" + PORT);
  console.log("ZMQ connecting to port:", PORT);

  const io = new Server(http);
  console.log("Socket.io server started");
  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  zmqSock.on("message", (msg: any) => {
    const obj = JSON.parse(msg.toString());
    // Get object keys
    const keys = Object.keys(obj);
    for (let key of keys) {
      io.emit(key, obj[key]);
    }
  });
};
