import type { ViteDevServer } from "vite";
import { Server } from "socket.io";
import zmq from "zeromq";
// import { createSockMockWork } from "./producer";

export let io: Server;
export let zmqSock: zmq.Socket;

// Plugin Definition
export default {
  name: "RGS Server Plugin",

  configureServer(server: ViteDevServer) {
    io = new Server(server.httpServer as any);
    zmqSock = zmq.socket("sub");

    const endpoint = process.env.ZMQ_ENDPOINT ?? "tcp://127.0.0.1:3000";
    console.log("ZMQ_ENDPOINT:", endpoint);
    zmqSock.connect(endpoint);
    zmqSock.subscribe("");
    console.log("Connecting to ZeroMQ endpoint");

    // Basically messages from the zmq socket to the socket.io socket
    zmqSock.on("message", (msg) => {
      let obj = JSON.parse(msg.toString());
      let rec = Date.now();
      let delta = rec - obj.timestamp;
      console.log("Delta:", delta, "ms");
      io.emit("zmq", JSON.stringify(obj));
    });
  },
};
