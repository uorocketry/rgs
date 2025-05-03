import { Database } from "bun:sqlite";
import { config } from "./lib/config";
import { TileDatabase } from "./lib/database";
import { DownloadQueue } from "./lib/downloadQueue";
import homepage from "./public/index.html";

// -----------------------
// Setup SQLite database
// -----------------------
console.log("Opening DB at:", config.database);
console.log("Using address:", config.address);
console.log("Using port:", config.port);

const db = new Database(config.database);
db.exec("PRAGMA journal_mode = WAL;");

// Create the tiles table if needed.
db.exec(`
  CREATE TABLE IF NOT EXISTS tiles (
    zoom INTEGER,
    x INTEGER,
    y INTEGER,
    blob BLOB,
    PRIMARY KEY (zoom, x, y)
  );
`);

// Initialize database and download queue
const tileDb = new TileDatabase(db);
const downloadQueue = new DownloadQueue(db);

// -----------------------
// HTTP handler
// -----------------------
async function handleTileRequest(
  zoom: string,
  x: string,
  y: string
): Promise<Response> {
  // Check the database.
  const dbBlob = tileDb.getTile(Number(zoom), Number(x), Number(y));
  if (dbBlob) {
    return new Response(dbBlob, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Fetch from the remote source.
  const url = `${config.tileSource.baseUrl}&x=${x}&y=${y}&z=${zoom}`;
  const response = await fetch(url);

  if (!response.ok) {
    return new Response(response.statusText, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  tileDb.saveTile(Number(zoom), Number(x), Number(y), buffer);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// -----------------------
// Main HTTP server route handling
// -----------------------
const server = Bun.serve({
  development: process.env.NODE_ENV !== "production",
  routes: {
    "/tiles/:zoom/:x/:y": async (req) => {
      const { zoom, x, y } = req.params;
      return handleTileRequest(zoom, x, y);
    },
    "/api/download": async (req) => {
      const body = await req.json();
      const result = await downloadQueue.queueDownload(body);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    },
    "/api/download/:jobId/status": async (req) => {
      const { jobId } = req.params;
      const job = await downloadQueue.getJobStatus(jobId);
      if (!job) {
        return new Response(JSON.stringify({ error: 'Job not found' }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
      return new Response(JSON.stringify(job), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    },
    "/api/download/:jobId/cancel": async (req) => {
      const { jobId } = req.params;
      const success = await downloadQueue.cancelDownload(jobId);
      return new Response(JSON.stringify({ success }), {
        status: success ? 200 : 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    },
    "/": homepage,
  },
  hostname: config.address,
  port: config.port,
});

console.log(`Starting server at ${config.address}:${config.port}`);
