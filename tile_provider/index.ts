import { Database } from "bun:sqlite";
import { parseArgs } from "util";
import process from "process";

// -----------------------
// CLI argument parsing
// -----------------------
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    address: { type: "string", default: process.env.ADDRESS ?? "127.0.0.1" },
    port: { type: "string", default: process.env.PORT ?? "6565" },
    database: {
      type: "string",
      default: process.env.DB_FILENAME ?? "tiles.db",
    },
  },
  strict: true,
  allowPositionals: true,
});

const ADDRESS = values.address ?? "127.0.0.1";
const PORT = values.port ?? "6565";
const DB_FILENAME = values.database ?? "tiles.db";

// -----------------------
// Setup SQLite database
// -----------------------
console.log("Opening DB at:", DB_FILENAME);
console.log("Using address:", ADDRESS);
console.log("Using port:", PORT);

const db = new Database(DB_FILENAME);

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

// -----------------------
// Database helper functions
// -----------------------

const getTileFromDBQuery = db.query(
  "SELECT blob FROM tiles WHERE zoom = ? AND x = ? AND y = ?"
);
function getTileFromDB(zoom: string, x: string, y: string) {
  const q = getTileFromDBQuery.get(zoom, x, y) as
    | { blob: Uint8Array }
    | undefined;
  return q ? q.blob : null;
}

const saveTileToDBQuery = db.prepare(
  "INSERT OR REPLACE INTO tiles (zoom, x, y, blob) VALUES (?, ?, ?, ?)"
);
function saveTileToDB(zoom: string, x: string, y: string, blob: Uint8Array) {
  saveTileToDBQuery.run(zoom, x, y, blob);
}

// -----------------------
// Remote fetch function
// -----------------------
type FetchResult =
  | {
      ok: true;
      buffer: Uint8Array;
    }
  | {
      ok: false;
      error: string;
    };

async function fetchTileFromSource(
  zoom: string,
  x: string,
  y: string
): Promise<FetchResult> {
  const url = `http://mt0.google.com/vt/lyrs=s,h&x=${x}&y=${y}&z=${zoom}`;

  const response = await fetch(url);

  if (!response.ok) {
    return { ok: false, error: response.statusText };
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  return { ok: true, buffer };
}

// -----------------------
// HTTP handler
// -----------------------
async function handleTileRequest(
  zoom: string,
  x: string,
  y: string
): Promise<Response> {
  // Check the database.
  const dbBlob = getTileFromDB(zoom, x, y);
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
  const fetchedBlob = await fetchTileFromSource(zoom, x, y);
  if (fetchedBlob.ok) {
    saveTileToDB(zoom, x, y, fetchedBlob.buffer);
    return new Response(fetchedBlob.buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    return new Response(fetchedBlob.error, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// -----------------------
// Main HTTP server route handling
// -----------------------
Bun.serve({
  async fetch(req: Request) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();

    // Handle CORS preflight request
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Expecting route like /tiles/<zoom>/<x>/<y>
    const pathParts = pathname.split("/").filter((p) => p.length > 0);
    if (
      method === "GET" &&
      pathParts.length === 4 &&
      pathParts[0] === "tiles"
    ) {
      return handleTileRequest(pathParts[1], pathParts[2], pathParts[3]);
    }

    // Fallback to 404.
    return new Response("Not Found", {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  },
  hostname: ADDRESS,
  port: PORT,
});

console.log(`Starting server at ${ADDRESS}:${PORT}`);
