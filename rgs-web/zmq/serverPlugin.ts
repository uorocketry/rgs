import type { ViteDevServer } from "vite";
import { Server } from "socket.io";
import zmq from "zeromq";
import { createSockMockWork } from "./producer";

export let io: Server;
export let zmqSock: zmq.Socket;

// Plugin Definition
export default {
  name: "RGS Server Plugin",

  configureServer(server: ViteDevServer) {
    if (!server.httpServer) {
      throw new Error("No HTTP server found");
    }
    try {
      io = new Server(server.httpServer);
    } catch (error) {
      console.error("Error creating socket.io server", error);
    }

    // Sets up zmq socket and endpoint
    zmqSock = zmq.socket("pull");
    // console.log(process.env);
    console.log("ZMQ_ENDPOINT", process.env.ZMQ_ENDPOINT);
    zmqSock.connect(process.env.ZMQ_ENDPOINT ?? "tcp://127.0.0.1:3000");

    // TODO: Remove this mock work after implementing the real thing
    try {
      createSockMockWork(); // Sends some mock data
    } catch (error) {
      console.error("Error creating mock work", error);
      // If you get an error: Error creating mock work Error: Address already in use
      // It's fine due to how the mock work is implemented
    }
    // https://zeromq.github.io/zeromq.js/interfaces/EventSubscriber.html#on
    zmqSock.on("accept", (msg) => {
      console.log("Server connected to ZeroMQ endpoint", msg);
    });

    // Basically messages from the zmq socket to the socket.io socket
    zmqSock.on("message", (msg) => {
      io.emit("zmq", msg.toString());
    });
  },
};
