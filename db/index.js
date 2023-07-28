import zmq from "zeromq";
import path from "path";
import PocketBase from "pocketbase";
// Ayo? 🤨
import cp from "child_process";
import { Console } from "console";

console.info("Started DB Service");
try {
  // Kill any existing PocketBase instances
  cp.execSync("killall pocketbase");
  console.info("Killed all pocketBase instances");
} catch (e) {
  // Ignore
}

console.info("Starting PocketBase Server");
const fileLoc = import.meta.url.replace("file://", "");
const pocketBaseLoc = path.join(path.dirname(fileLoc), "pocketbase");
const pbServer = cp.spawn(pocketBaseLoc, ["serve"], {
  stdio: ["inherit", "inherit", "inherit", "ipc"],
});

// Kill PocketBase server on exit
process.on("exit", async () => {
  console.warn("Killing PocketBase Server");
  pbServer?.kill();
});

// Keep calling http://127.0.0.1:8090/api/health until it responds
const TIMEOUT = 5000;
const start = Date.now();
let started = false;
while (!started) {
  try {
    const res = await fetch("http://127.0.0.1:8090/api/health", {
      method: "GET",
    });
    if (res.status === 200) {
      console.info("PocketBase server started successfully");
      started = true;
    }
  } catch (e) {
    // Ignore
  }
  if (Date.now() - start > TIMEOUT) {
    console.error("PocketBase server did not start in time");
    throw new Error("PocketBase server did not start in time");
  }
}

// Connect to PocketBase server
if (process.env.DB_ADMIN === undefined || process.env.DB_ADMIN === "") {
  console.error("DB_ADMIN is not set");
  throw new Error("DB_ADMIN is not set");
}
if (
  process.env.DB_ADMIN_PASSWORD === undefined ||
  process.env.DB_ADMIN_PASSWORD === ""
) {
  console.error("DB_ADMIN_PASSWORD is not set");
  throw new Error("DB_ADMIN_PASSWORD is not set");
}
if (process.env.DB_REST_PORT === undefined || process.env.DB_REST_PORT === "") {
  console.error("DB_REST_PORT is not set");
  throw new Error("DB_REST_PORT is not set");
}

console.info("Creating default admin user");
cp.execSync(
  `${pocketBaseLoc} admin create ${process.env.DB_ADMIN} ${process.env.DB_ADMIN_PASSWORD}`
);
console.info("Connecting to PocketBase server");
const pb = new PocketBase(
  `http://127.0.0.1:${process.env.DB_REST_PORT ?? "8090"}`
);
await pb.admins.authWithPassword(
  process.env.DB_ADMIN,
  process.env.DB_ADMIN_PASSWORD
);

// Setup ZMQ subscriber
/**
 * @type {zmq.Subscriber}
 */
const zmqSock = new zmq.Subscriber();
zmqSock.connectTimeout = 1000;
zmqSock.connect(`tcp://localhost:${process.env.ZMQ_PORT ?? "3002"}`);
zmqSock.subscribe();

console.log(
  "Connected to ZMQ on address",
  `tcp://localhost:${process.env.ZMQ_PORT ?? "3002"}`
);

zmqSock.events.on("handshake", (fd, ep) => {
  console.log("handshake", fd, ep);
});

// Listen and store messages
for await (const [msg] of zmqSock) {
  console.log("aaaaa");
  const obj = JSON.parse(msg.toString());
  console.info("Received message", obj);
  if ("RocketMessage" in obj) {
    const rocketMsg = obj.RocketMessage;
    const rocketData = rocketMsg.data; // Data
    pb.collection("raw").create(rocketData);
    console.info("Adding raw data", rocketData);
    // { state: State } | { sensor: Sensor } | { log: Log };
    if ("state" in rocketData) {
      const dataState = rocketData.state; // State
      console.log("state");
    } else if ("sensor" in rocketData) {
      const dataSensor = rocketData.sensor; // Sensor
      const sensorData = dataSensor.data;
      if ("UtcTime" in sensorData) {
        // console.info('Adding UtcTime');
      } else if ("Air" in sensorData) {
        // console.info('Adding Air');
      } else if ("EkfQuat" in sensorData) {
        console.info("Sending quats");
        pb.collection("EkfQuat").create(
          {
            timestamp: sensorData.EkfQuat.time_stamp,
            q0: sensorData.EkfQuat.quaternion[0],
            q1: sensorData.EkfQuat.quaternion[1],
            q2: sensorData.EkfQuat.quaternion[2],
            q3: sensorData.EkfQuat.quaternion[3],
            roll: sensorData.EkfQuat.euler_std_dev[0],
            pitch: sensorData.EkfQuat.euler_std_dev[1],
            yaw: sensorData.EkfQuat.euler_std_dev[2],
            status: sensorData.EkfQuat.status,
          },
          {
            $autoCancel: false,
          }
        );
        // console.info('Adding EkfQuat');
      } else if ("EkfNav1" in sensorData) {
        // console.info('Adding EkfNav1');
      } else if ("EkfNav2" in sensorData) {
        // console.info('Adding EkfNav2');
      } else if ("Imu1" in sensorData) {
        // console.log(sensorData.Imu1);
        // console.info('Adding Imu1');
      } else if ("Imu2" in sensorData) {
        // console.log(sensorData.Imu2);
        // console.info('Adding Imu2');
      } else if ("GpsVel" in sensorData) {
        // console.info('Adding GpsVel');
      }
    } else if ("log" in rocketData) {
      const dataLog = rocketData.log; // Log
      console.log("log");
    }
  } else if ("LinkStatus" in obj) {
    // console.info('Adding Link Status');
  } else {
    console.error("Unknown message type", obj);
  }
}

console.info("DB Service exited");
