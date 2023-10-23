import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";

let id = 0;
const app = new Hono().use("*", cors()).get("/", (c) => {
  return c.json({ message: "Hello Bun!" });
});
app.get("/sse", async (c) => {
  return streamSSE(c, async (stream) => {
    console.log("New client connected!");
    let n = 0;

    while (true) {
      // Check if stream is closed
      // if (c.res.c) {
      //   console.log("Client disconnected!");
      //   break;
      // }

      n++;
      const message = `It is ${new Date().toISOString()}`;
      await stream.writeSSE({
        data: message,
        event: "data",
        id: (id++).toString(),
      });
      await stream.sleep(1000);
      console.log(n);
    }
  });
});

export default {
  fetch: app.fetch as typeof fetch,
  port: 3001,
};
