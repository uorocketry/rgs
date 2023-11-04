import PocketBase from "pocketbase";
import zmq from "zeromq";
// Ayo? 🤨
import {
  Air,
  Data,
  EkfNav1,
  EkfNav2,
  GpsPos1,
  GpsPos2,
  GpsVel,
  Imu1,
  Imu2,
  LinkStatus,
  ProcessedMessage,
  StateData,
  UtcTime,
} from "@rgs/bindings";

function envRequired(name: string): string {
  const val = process.env[name];
  if (val === undefined || val === "") {
    console.error(`${name} is not set`);
    throw new Error(`${name} is not set`);
  }
  return val;
}

envRequired("DB_REST_PORT");
envRequired("DB_ADMIN");
envRequired("DB_ADMIN_PASSWORD");
envRequired("XPUB_PORT");

console.info("Started PB Service");

import { spawn } from "child_process";
let platformName = process.platform;
const child = spawn(`./bin/${platformName}/pocketbase`, [
  "serve",
  '--dir=pb_data',
  '--publicDir=pb_public',
  '--migrationsDir=pb_migrations',
  `--http=0.0.0.0:${process.env.DB_REST_PORT}`,
]);
// print output of child process
child.stdout.on("data", (data) => {
  console.log(`PB: ${data}`);
});

// Keep calling http://127.0.0.1:8090/api/health until it responds
const TIMEOUT = 5000;
const start = Date.now();
let started = false;
while (!started) {
  try {
    const res = await fetch(
      `http://127.0.0.1:${process.env.DB_REST_PORT}/api/health`,
      {
        method: "GET",
      }
    );
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

console.log("Health check passed, PocketBase server started successfully");

// Connect to PocketBase server

console.info("Connecting to PocketBase server");
const pb = new PocketBase(`http://127.0.0.1:${process.env.DB_REST_PORT}`);
await pb.admins.authWithPassword(
  process.env.DB_ADMIN!,
  process.env.DB_ADMIN_PASSWORD!
);

const PORT = process.env.XPUB_PORT!;
// Setup ZMQ subscriber
/**
 * @type {zmq.Subscriber}
 */
const zmqSock = new zmq.Subscriber();
zmqSock.connect(`tcp://localhost:${PORT}`);
zmqSock.subscribe();

console.log("Connected to ZMQ on address", `tcp://localhost:${PORT}`);
// Listen and store messages
for await (const [msg] of zmqSock) {
  const obj = JSON.parse(msg.toString()) as ProcessedMessage;
  if ("RocketMessage" in obj) {
    const rocketMsg = obj.RocketMessage;

    const rocketData: Data = rocketMsg.data;
    pb.collection("raw").create(
      {
        data: rocketData,
      },
      {
        $autoCancel: false,
      }
    );

    console.info("RocketData:", JSON.stringify(rocketData));
    // { state: State } | { sensor: Sensor } | { log: Log };
    if ("state" in rocketData) {
      const dataState = rocketData.state; // State
      const stateData: StateData = dataState.data;
      pb.collection("State").create(
        {
          status: stateData,
        },
        {
          $autoCancel: false,
        }
      );
    } else if ("sensor" in rocketData) {
      const dataSensor = rocketData.sensor; // Sensor
      const sensorData = dataSensor.data;
      if ("UtcTime" in sensorData) {
        const utcTime = sensorData.UtcTime as UtcTime;
        // No use yet, but its already stored in the raw data
      } else if ("Air" in sensorData) {
        const air = sensorData.Air as Air;
        pb.collection("Air").create(
          {
            timestamp: air.time_stamp,
            status: air.status,
            pressure_abs: air.pressure_abs,
            altitude: air.altitude,
            pressure_diff: air.pressure_diff,
            true_airspeed: air.true_airspeed,
            air_temperature: air.air_temperature,
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("EkfQuat" in sensorData) {
        await pb.collection("EkfQuat").create(
          {
            time_stamp: sensorData.EkfQuat.time_stamp,
            quaternion_0: sensorData.EkfQuat.quaternion[0],
            quaternion_1: sensorData.EkfQuat.quaternion[1],
            quaternion_2: sensorData.EkfQuat.quaternion[2],
            quaternion_3: sensorData.EkfQuat.quaternion[3],
            euler_std_dev_0: sensorData.EkfQuat.euler_std_dev[0],
            euler_std_dev_1: sensorData.EkfQuat.euler_std_dev[1],
            euler_std_dev_2: sensorData.EkfQuat.euler_std_dev[2],
            status: sensorData.EkfQuat.status,
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("EkfNav1" in sensorData) {
        const ekfNav1 = sensorData.EkfNav1 as EkfNav1;
        pb.collection("EkfNav1").create(
          {
            time_stamp: ekfNav1.time_stamp,
            velocity_0: ekfNav1.velocity[0],
            velocity_1: ekfNav1.velocity[1],
            velocity_2: ekfNav1.velocity[2],
            velocity_std_dev_0: ekfNav1.velocity_std_dev[0],
            velocity_std_dev_1: ekfNav1.velocity_std_dev[1],
            velocity_std_dev_2: ekfNav1.velocity_std_dev[2],
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("EkfNav2" in sensorData) {
        const ekfNav2 = sensorData.EkfNav2 as EkfNav2;
        pb.collection("EkfNav2").create(
          {
            position_0: ekfNav2.position[0],
            position_1: ekfNav2.position[1],
            position_2: ekfNav2.position[2],
            undulation: ekfNav2.undulation,
            position_std_dev_0: ekfNav2.position_std_dev[0],
            position_std_dev_1: ekfNav2.position_std_dev[1],
            position_std_dev_2: ekfNav2.position_std_dev[2],
            status: ekfNav2.status,
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("Imu1" in sensorData) {
        const imu1 = sensorData.Imu1 as Imu1;
        pb.collection("Imu1").create(
          {
            time_stamp: imu1.time_stamp,
            status: imu1.status,
            accelerometers_0: imu1.accelerometers[0],
            accelerometers_1: imu1.accelerometers[1],
            accelerometers_2: imu1.accelerometers[2],
            gyroscopes_0: imu1.gyroscopes[0],
            gyroscopes_1: imu1.gyroscopes[1],
            gyroscopes_2: imu1.gyroscopes[2],
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("Imu2" in sensorData) {
        const imu2 = sensorData.Imu2 as Imu2;

        pb.collection("Imu2").create(
          {
            temperature: imu2.temperature,
            delta_velocity_0: imu2.delta_velocity[0],
            delta_velocity_1: imu2.delta_velocity[1],
            delta_velocity_2: imu2.delta_velocity[2],
            delta_angle_0: imu2.delta_angle[0],
            delta_angle_1: imu2.delta_angle[1],
            delta_angle_2: imu2.delta_angle[2],
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("GpsVel" in sensorData) {
        const gpsVel = sensorData.GpsVel as GpsVel;
        //  export interface GpsVel { time_stamp: number, status: number, time_of_week: number, velocity: Array<number>, velocity_acc: Array<number>, course: number, course_acc: number, }
        pb.collection("GpsVel").create(
          {
            time_stamp: gpsVel.time_stamp,
            status: gpsVel.status,
            time_of_week: gpsVel.time_of_week,
            velocity_0: gpsVel.velocity[0],
            velocity_1: gpsVel.velocity[1],
            velocity_2: gpsVel.velocity[2],
            velocity_acc_0: gpsVel.velocity_acc[0],
            velocity_acc_1: gpsVel.velocity_acc[1],
            velocity_acc_2: gpsVel.velocity_acc[2],
            course: gpsVel.course,
            course_acc: gpsVel.course_acc,
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("GpsPos1" in sensorData) {
        const gpsPos1 = sensorData.GpsPos1 as GpsPos1;
        pb.collection("GpsPos1").create(
          {
            time_stamp: gpsPos1.timeStamp,
            status: gpsPos1.status,
            time_of_week: gpsPos1.timeOfWeek,
            latitude: gpsPos1.latitude,
            longitude: gpsPos1.longitude,
            altitude: gpsPos1.altitude,
            undulation: gpsPos1.undulation,
          },
          {
            $autoCancel: false,
          }
        );
      } else if ("GpsPos2" in sensorData) {
        const gpsPos2 = sensorData.GpsPos2 as GpsPos2;
        pb.collection("GpsPos2").create(
          {
            latitude_acc: gpsPos2.latitudeAccuracy,
            longitude_acc: gpsPos2.longitudeAccuracy,
            altitude_acc: gpsPos2.altitudeAccuracy,
            num_sv_used: gpsPos2.numSvUsed,
            base_station_id: gpsPos2.baseStationId,
            differential_age: gpsPos2.differentialAge,
          },
          {
            $autoCancel: false,
          }
        );
      }
    } else if ("log" in rocketData) {
      const dataLog = rocketData.log; // Log
      pb.collection("Log").create(
        {
          level: dataLog.level,
          event: dataLog.event,
        },
        {
          $autoCancel: false,
        }
      );
    } else {
      console.error("Unknown RocketData type");
      console.error(JSON.stringify(obj));
    }
  } else if ("LinkStatus" in obj) {
    const linkStatus = obj.LinkStatus as LinkStatus;
    pb.collection("LinkStatus").create(
      {
        rssi: linkStatus.rssi,
        remrssi: linkStatus.remrssi,
        txbuf: linkStatus.txbuf,
        noise: linkStatus.noise,
        remnoise: linkStatus.remnoise,
        rxerrors: linkStatus.rxerrors,
        fixed: linkStatus.fixed,
        recent_error_rate: linkStatus.recent_error_rate,
        missed_messages: linkStatus.missed_messages,
        connected: linkStatus.connected,
      },
      {
        $autoCancel: false,
      }
    );
  } else {
    // Unknown message type
    console.error("ERR:", JSON.stringify(obj));
  }
}

console.info("DB Service exited");
