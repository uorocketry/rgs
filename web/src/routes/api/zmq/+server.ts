// api/tiles/[z]/[x]/[y]/+server.ts
import zmq from "zeromq";

// Setup ZMQ subscriber
const zmqSock = new zmq.Publisher();
await zmqSock.bind(`tcp://*:${import.meta.env.VITE_ZMQ_PORT ?? "3002"}`);
console.log("Binding zmq")
console.log("Connect to ZMQ on address", `tcp://localhost:${import.meta.env.VITE_ZMQ_PORT ?? "3002"}`);

export async function POST(req) {
    await zmqSock.send(await req.request.text());
    return new Response("OK")
}


