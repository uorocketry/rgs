#!/usr/bin/env node
import { createServer } from "http";
import { Server } from "socket.io";
import zmq from "zeromq";

const PORT = 3002;
const zmqSock = zmq.socket("sub");
zmqSock.subscribe("");
zmqSock.connect("tcp://localhost:" + PORT);
console.log("ZMQ connecting to port " + PORT);

const io = new Server();

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

zmqSock.on("message", (msg) => {
  // console.log("Received message from ZMQ: ", msg.toString());
  io.emit("zqm", msg.toString());
});

console.log("Listening on port 3001");
io.listen(3001);
