import { setTimeout } from "timers/promises";
import https from "https";

// Ignore self-signed certs
const agent = new https.Agent({ rejectUnauthorized: false });

function deg2tile(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom;
  const xTile = Math.floor(((lon + 180) / 360) * n);
  const yTile = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      n
  );
  return [xTile, yTile];
}

function tileSizeKm(zoom: number, lat: number) {
  const earthCircumferenceKm = 40075.017;
  const n = 2 ** zoom;
  const tileKm = earthCircumferenceKm / n;
  return tileKm * Math.cos((lat * Math.PI) / 180);
}

function generateTileUrls(
  lat: number,
  lon: number,
  minZoom: number,
  maxZoom: number,
  radiusKm: number
): string[] {
  const urls: string[] = [];

  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const [xCenter, yCenter] = deg2tile(lat, lon, zoom);
    const tileKm = tileSizeKm(zoom, lat);
    const radiusTiles = Math.ceil(radiusKm / tileKm);

    const xMin = Math.max(0, xCenter - radiusTiles);
    const xMax = Math.min(2 ** zoom - 1, xCenter + radiusTiles);
    const yMin = Math.max(0, yCenter - radiusTiles);
    const yMax = Math.min(2 ** zoom - 1, yCenter + radiusTiles);

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        urls.push(`http://localhost:6565/tiles/${zoom}/${x}/${y}`);
      }
    }
  }

  return urls;
}

const lat = 47.99108;
const lon = -81.851242;
const minZoom = 1;
const maxZoom = 18;
const radiusKm = 10;
const sleepT = 69; // milliseconds
const urls = generateTileUrls(lat, lon, minZoom, maxZoom, radiusKm);

console.log("Total URLs:", urls.length);

const reqTimes: number[] = [];

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  console.log(`Downloading tile ${i + 1}/${urls.length}`);

  const start = performance.now();
  try {
    const res = await fetch(url, { agent });
    await res.arrayBuffer(); // force data read
  } catch (err) {
    console.error("Failed to fetch:", url, err);
  }
  const duration = performance.now() - start;
  reqTimes.push(duration);

  if (reqTimes.length > 100) reqTimes.shift();

  if (i % 10 === 0 && reqTimes.length) {
    const avg = reqTimes.reduce((a, b) => a + b, 0) / reqTimes.length;
    const remaining = (urls.length - i) * avg;
    const minutes = Math.floor(remaining / 60000);
    const seconds = (remaining % 60000) / 1000;

    console.log(
      `\nEstimated time remaining: ${minutes} minutes ${seconds.toFixed(
        2
      )} seconds\n`
    );
  }

  await setTimeout(sleepT);
}
