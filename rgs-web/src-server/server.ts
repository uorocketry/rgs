import zmq from "zeromq";
import type { Server as HTTPServer } from "http";
import fs from "fs";
import { Server } from "socket.io";

const randomId = () => {
  return Math.random().toString(36);
};

enum Role {
  Spectator = "spectator",
  FIDO = "fido", // Flight Dynamics Officer
  ASD = "asd", // Assistant Flight Director
  INCO = "inco", // Instrumentation and Communications Officer
  RECOVERY = "recovery", // Recovery Officer
}

type Message = {
  timestamp: number;
  message: string;
  sender: string;
};

class User {
  id: string = "";
  secret: string = "";
}

class ServerData {
  loggedUsers: Map<string, User> = new Map(); // Maps socket.id to user
  userCreds: Map<string, string> = new Map(); // Maps uuid to secret for login
  tMinus: number | null = null;
  chat: Message[] = [];
}

function getUserIDs(): string[] {
  return Array.from(serverData.loggedUsers.values()).map((user) => user.id);
}

const serverData: ServerData = new ServerData();

export const setupServer = (http: HTTPServer) => {
  // If data folder is not present, create it
  if (!fs.existsSync("data")) {
    console.log("Created data folder");
    fs.mkdirSync("data");
  }

  // If server.json is not present, create it
  if (!fs.existsSync("data/server.json")) {
    console.log("Created server.json");
    // We will use this file to store the state of the server
    fs.writeFileSync("data/server.json", JSON.stringify({}));
  }

  const PORT = 3002;
  const zmqSock = zmq.socket("sub");
  zmqSock.subscribe("");
  zmqSock.connect("tcp://localhost:" + PORT);
  console.log("ZMQ connecting to port:", PORT);

  const io = new Server(http);
  console.log("Socket.io server started");
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      if (serverData.loggedUsers.has(socket.id)) {
        serverData.loggedUsers.delete(socket.id);
        io.emit("loggedUsers", getUserIDs());
      }
      console.log("Client disconnected");
    });

    // We shouldn't trust the client to send anything correct
    socket.on("chat", (msg: Message) => {
      msg.sender = serverData.loggedUsers.get(socket.id)?.id || "Unknown";
      serverData.chat.push(msg);
      io.emit("chat", msg);
    });

    socket.on("login", (uuid: string, secret: string) => {
      // Check if uuid is not already in use
      if (serverData.userCreds.has(uuid)) {
        // We are trying to login
        if (serverData.userCreds.get(uuid) === secret) {
          // Login successful
          serverData.loggedUsers.set(socket.id, {
            id: uuid,
            secret: secret,
          });
          console.log("Logged in user:", uuid);
          io.emit("loggedUsers", getUserIDs());
        } else {
          console.error("Login failed for user:", uuid);
        }
      } else {
        // We are trying to register
        serverData.userCreds.set(uuid, secret);
        console.log("Registered user:", uuid);
        serverData.loggedUsers.set(socket.id, {
          id: uuid,
          secret: secret,
        });
        io.emit("loggedUsers", getUserIDs());
      }
    });
  });

  zmqSock.on("message", (msg: any) => {
    const obj = JSON.parse(msg.toString());
    const keys = Object.keys(obj);
    for (let key of keys) {
      io.emit(key, obj[key]);
    }
  });
};