import zmq from "zeromq";
import PocketBase from "pocketbase";
// Ayo? 🤨
import { Air, Data, EkfNav1, EkfNav2, GpsVel, Imu1, Imu2, LinkStatus, ProcessedMessage, UtcTime } from "@rgs/bindings"

console.info("Started DB Service");

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

// Listen and store messages
for await (const [msg] of zmqSock) {
  const obj = JSON.parse(msg.toString()) as ProcessedMessage;
  if ("RocketMessage" in obj) {
    const rocketMsg = obj.RocketMessage;
    const rocketData: Data = rocketMsg.data;
    pb.collection("raw").create({
      data: rocketData
    },
    {
        $autoCancel: false,
    });

    console.info("Adding raw data", rocketData);
    // { state: State } | { sensor: Sensor } | { log: Log };
    if ("state" in rocketData) {
      const dataState = rocketData.state; // State
      console.log("State", dataState);
      pb.collection("State").create({
        status: dataState.status,
        has_error: dataState.has_error,
      // },
      // {
      //     $autoCancel: false,
      });
    } else if ("sensor" in rocketData) {
      const dataSensor = rocketData.sensor; // Sensor
      const sensorData = dataSensor.data;
      if ("UtcTime" in sensorData) {
        const utcTime = sensorData.UtcTime as UtcTime;
        // No use yet, but its already stored in the raw data
      } else if ("Air" in sensorData) {
        const air = sensorData.Air as Air;
        pb.collection("Air").create({
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
          });

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
          }, {
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
          }, {
          $autoCancel: false,
        });

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
          }, {
          $autoCancel: false,
        });

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
          }, {
          $autoCancel: false,
        });


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
          }, {
          $autoCancel: false,
        });

      }
    } else if ("log" in rocketData) {
      const dataLog = rocketData.log; // Log
      pb.collection("Log").create({
        level: dataLog.level,
        event: dataLog.event,
      },
      {
          $autoCancel: false,
      });
    }
  } else if ("LinkStatus" in obj) {
    const linkStatus = obj.LinkStatus as LinkStatus;
    pb.collection("LinkStatus").create({
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
    });
  } else {
    console.error("Unknown message type", obj);
  }
}

console.info("DB Service exited");
