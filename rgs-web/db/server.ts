import zmq from "zeromq";
import type { Server as HTTPServer } from "http";
import type { ProcessedMessage } from "$lib/common/Bindings";
import PocketBase from "pocketbase";
// Ayo? 🤨
import cp from "child_process";

export const setupServer = async (http: HTTPServer) => {
  console.log("#### Setting up PocketBase Server ####");

  cp.spawn("./db/pocketbase", ["serve"], {
    stdio: ["inherit", "inherit", "inherit", "ipc"],
  });

  // Wait 0.5 seconds for PocketBase to start
  await new Promise((resolve) => setTimeout(resolve, 500));

  const pb = new PocketBase("http://127.0.0.1:8090");
  const auth = await pb.admins.authWithPassword(
    "admin@admin.com",
    "adminadmin"
  );

  // expect zmq sub socket to run on port 3002
  const zmqSock = new zmq.Subscriber();
  zmqSock.connect("tcp://localhost:3002");
  zmqSock.subscribe();

  const onMessage = async () => {
    console.log("Listening for ZMQ messages");
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

  onMessage();
};
