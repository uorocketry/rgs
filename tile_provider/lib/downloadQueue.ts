import { Database } from "bun:sqlite";
import { config } from "./config";
import { TileDatabase } from "./database";

export interface DownloadJob {
  id: string;
  lat: number;
  lon: number;
  minZoom: number;
  maxZoom: number;
  radiusKm: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  downloaded: number;
  total: number;
  error?: string;
}

interface TileCoordinates {
  zoom: number;
  x: number;
  y: number;
}

interface DownloadResult {
  success: boolean;
  error?: string;
  jobId?: string;
  downloaded: number;
  total: number;
}

function deg2tile(lat: number, lon: number, zoom: number): [number, number] {
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

function generateTileUrls(job: DownloadJob): TileCoordinates[] {
  const urls: TileCoordinates[] = [];

  for (let zoom = job.minZoom; zoom <= job.maxZoom; zoom++) {
    const [xCenter, yCenter] = deg2tile(job.lat, job.lon, zoom);
    const n = 2 ** zoom;

    // Calculate radius in tiles (approximate)
    const earthRadius = 6371; // km
    const tileSize = (2 * Math.PI * earthRadius) / n;
    const radiusTiles = Math.ceil(job.radiusKm / tileSize);

    // Calculate bounds
    const xMin = Math.max(0, xCenter - radiusTiles);
    const xMax = Math.min(n - 1, xCenter + radiusTiles);
    const yMin = Math.max(0, yCenter - radiusTiles);
    const yMax = Math.min(n - 1, yCenter + radiusTiles);

    // Generate URLs
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        urls.push({ zoom, x, y });
      }
    }
  }

  return urls;
}

export class DownloadQueue {
  private jobs: Map<string, DownloadJob> = new Map();
  private isProcessing = false;
  private db: TileDatabase;
  private currentJobId: string | null = null;
  private shuttingDown = false;
  private inflightAbort: AbortController | null = null;

  constructor(db: Database) {
    this.db = new TileDatabase(db);
  }

  async queueDownload(job: Omit<DownloadJob, 'id' | 'status' | 'downloaded' | 'total'>): Promise<DownloadResult> {
    try {
      const id = crypto.randomUUID();
      const newJob: DownloadJob = {
        ...job,
        id,
        status: 'pending',
        downloaded: 0,
        total: 0
      };

      this.jobs.set(id, newJob);

      if (!this.isProcessing) {
        this.processQueue();
      }

      return {
        success: true,
        jobId: id,
        downloaded: 0,
        total: 0
      };
    } catch (error) {
      console.error('Error queueing download:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        downloaded: 0,
        total: 0
      };
    }
  }

  async cancelDownload(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.status === 'processing' && this.currentJobId === jobId) {
      job.status = 'cancelled';
      return true;
    }

    return false;
  }

  shutdown(): void {
    this.shuttingDown = true;
    if (this.inflightAbort) {
      try { this.inflightAbort.abort(); } catch {}
    }
  }

  async getJobStatus(jobId: string): Promise<DownloadJob | null> {
    return this.jobs.get(jobId) || null;
  }

  private async processQueue(): Promise<void> {
    if (this.jobs.size === 0 || this.shuttingDown) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const job = Array.from(this.jobs.values()).find(j => j.status === 'pending');

    if (!job) {
      this.isProcessing = false;
      return;
    }

    this.currentJobId = job.id;
    job.status = 'processing';

    try {
      const urls = generateTileUrls(job);

      // Batch check which tiles already exist
      const existingTiles = this.db.batchCheckTiles(urls.map(url => ({ ...url, blob: new Uint8Array() })));
      const tilesToDownload = urls.filter(url =>
        !existingTiles.has(`${url.zoom}/${url.x}/${url.y}`)
      );
      job.total = tilesToDownload.length;

      console.log(`Processing download job ${job.id}: ${tilesToDownload.length} tiles to download`);

      for (const url of tilesToDownload) {
        if (job.status !== 'processing' || this.shuttingDown) {
          break;
        }

        try {
          const result = await this.fetchTileFromSource(url.zoom, url.x, url.y);
          if (result.ok && result.buffer) {
            if (this.db.saveTile(url.zoom, url.x, url.y, result.buffer)) {
              job.downloaded++;
            }
          }
          // Add small delay to avoid overwhelming the source; skip if shutting down
          if (this.shuttingDown) break;
          await new Promise(resolve => setTimeout(resolve, config.download.delayMs));
        } catch (error) {
          if ((error as any)?.name === 'AbortError') {
            // Graceful shutdown; mark as cancelled
            job.status = 'cancelled';
            break;
          }
          console.error(`Failed to download tile: ${url}`, error);
          job.status = 'failed';
          job.error = error instanceof Error ? error.message : 'Unknown error';
          break;
        } finally {
          this.inflightAbort = null;
        }
      }

      if (job.status === 'processing') {
        job.status = 'completed';
      }
    } catch (error) {
      console.error('Error processing download job:', error);
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.currentJobId = null;
      // Process next job
      if (!this.shuttingDown) this.processQueue();
    }
  }

  private async fetchTileFromSource(zoom: number, x: number, y: number) {
    const url = `${config.tileSource.baseUrl}&x=${x}&y=${y}&z=${zoom}`;
    const controller = new AbortController();
    this.inflightAbort = controller;
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      return { ok: false, error: response.statusText };
    }

    const buffer = new Uint8Array(await response.arrayBuffer());
    return { ok: true, buffer };
  }
}
