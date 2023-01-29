import zmq from "zeromq";

interface ZMQMessage {
  type: string;
  data: any;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface IMU {
  pressure: number;
  temperature: number;
  humidity: number;
}

export function createSockMockWork() {
  let sock = zmq.socket("push");

  sock.bindSync("tcp://127.0.0.1:3000");
  console.log("Producer bound to port 3000");

  let pos: Position = { x: 0, y: 0, z: 0 };
  let imu: IMU = { pressure: 0, temperature: 0, humidity: 0 };
  setInterval(() => {
    imu.humidity += -5 + Math.random() * 10;
    imu.pressure += -5 + Math.random() * 10;
    imu.temperature += -5 + Math.random() * 10;
    pos.x += 1;
    pos.y += 1;
    pos.z += 1;
    sock.send(JSON.stringify({ type: "imu", data: imu }));
    sock.send(JSON.stringify({ type: "position", data: pos }));
  }, 300);
}
