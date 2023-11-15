import { spawn } from 'child_process';

const pm2 = spawn('pm2', ['logs']);
const stream = new ReadableStream({
    start(controller) {
        pm2.stdout.on("data", (data) => {
            controller.enqueue(String(data));
        });
    }
});

export function GET({ url }) {
    return new Response(stream, {
        headers: {
            "content-type": "text/event-stream",
        }
    })
}