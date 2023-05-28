import zmq from "zeromq";
import type { Server as HTTPServer } from "http";
import type { ProcessedMessage } from "$lib/common/Bindings";
import PocketBase from "pocketbase";
// Ayo? 🤨
import cp from "child_process";
import { loggerFactory } from "../logger";
export const logger = loggerFactory("db");

export const setupServer = async (http: HTTPServer) => {
  // Check if PocketBase is already running
  let pbServer: cp.ChildProcess;
  let pb: PocketBase;

  logger.info("Started DB server");
  try {
    // Kill any existing PocketBase instances
    cp.execSync("killall pocketbase");
    logger.info("Killed PocketBase instances");
  } catch (e) {
    // Ignore
  }

  logger.warn("No PocketBase instances found (Starting PocketBase server)");
  logger.info("Starting PocketBase Server");
  pbServer = cp.spawn("./db/pocketbase", ["serve"], {
    stdio: ["inherit", "inherit", "inherit", "ipc"],
  });
  // Kill PocketBase server on exit
  http.addListener("close", async () => {
    logger.warn("Killing PocketBase Server");
    pbServer?.kill();
  });

  await new Promise((resolve) => setTimeout(resolve, 250));
  logger.info("Started PocketBase Server");

  // Connect to PocketBase server
  console.log("Connecting to PocketBase server");
  pb = new PocketBase("http://127.0.0.1:8090");
  const auth = await pb.admins.authWithPassword("admin@db.com", "adminadmin");

  // Setup ZMQ subscriber
  const zmqSock = new zmq.Subscriber();
  zmqSock.connect("tcp://localhost:3002");
  zmqSock.subscribe();

  // Listen and store messages
  for await (const [msg] of zmqSock) {
    const obj = JSON.parse(msg.toString()) as ProcessedMessage;
    if ("RocketMessage" in obj) {
      const rocketMsg = obj.RocketMessage;
      if ("state" in rocketMsg.data) {
        pb.collection("state").create(rocketMsg.data.state);
      } else {
        pb.collection("sbg").create(rocketMsg.data.sensor.data.Sbg);
      }
    } else if ("LinkStatus" in obj) {
      pb.collection("link_status").create(obj.LinkStatus);
    } else {
      console.error("Unknown message type", obj);
    }
  }
};
