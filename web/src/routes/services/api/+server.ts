import { error, json } from '@sveltejs/kit';
import http from 'node:http';
import type { IncomingMessage } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

type ComposeServiceStatus = 'running' | 'exited' | 'restarting' | 'unknown';

const DOCKER_SOCKET = '/var/run/docker.sock';

function dockerRequest(path: string, method = 'GET', body?: string): Promise<{ status: number; text: () => Promise<string>; json: () => Promise<any>; ok: boolean; }> {
  return new Promise((resolve, reject) => {
    const req = http.request({
      socketPath: DOCKER_SOCKET,
      path,
      method,
      headers: body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : undefined
    }, (res: IncomingMessage) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const status = res.statusCode ?? 500;
        resolve({
          status,
          ok: status >= 200 && status < 300,
          text: async () => buf.toString('utf8'),
          json: async () => JSON.parse(buf.toString('utf8') || 'null')
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function listServices(): Promise<{ name: string; status: ComposeServiceStatus }[]> {
  // Query containers with label com.docker.compose.project=rgs
  const res = await dockerRequest('/containers/json?all=true');
  if (!res.ok) throw new Error(`Docker API error: ${res.status}`);
  const items: any[] = await res.json();
  return items
    .filter((c) => c.Labels && c.Labels['com.docker.compose.project'] === 'rgs')
    .map((c) => ({
      name: c.Names?.[0]?.replace(/^\//, '') ?? c.Id.substring(0, 12),
      status: (c.State as ComposeServiceStatus) ?? 'unknown',
      composeService: c.Labels?.['com.docker.compose.service'] ?? null
    }));
}

const execFileAsync = promisify(execFile);

async function composeAction(service: string, action: 'start' | 'stop' | 'restart') {
  // Run docker compose commands in repo root so compose file is picked up
  const cwd = path.resolve(process.cwd(), '..');
  const args: string[] = ['compose'];
  if (action === 'start') {
    // up -d <service>
    args.push('up', '-d', service);
  } else if (action === 'stop') {
    args.push('stop', service);
  } else if (action === 'restart') {
    args.push('restart', service);
  }
  try {
    const { stdout, stderr } = await execFileAsync('docker', args, { cwd, timeout: 60_000 });
    return { ok: true, stdout, stderr };
  } catch (e: any) {
    return { ok: false, error: e?.stderr || e?.message || String(e) };
  }
}

async function containerAction(service: string, action: 'start' | 'stop' | 'restart') {
  // Prefer docker compose (ensures config/build/env/volumes are honored)
  const composeRes = await composeAction(service, action);
  if (composeRes.ok) return;

  // Fallback to direct container action by name
  let p = `/containers/${service}/${action}`;
  if (action === 'restart') p += '?t=5';
  const res = await dockerRequest(p, 'POST');
  if (!(res.status === 204 || res.status === 304)) {
    throw new Error(`Docker ${action} failed with status ${res.status}`);
  }
}

export async function GET() {
  try {
    const services = await listServices();
    return json(services);
  } catch (e: any) {
    throw error(500, e.message ?? 'Failed to list services');
  }
}

export async function POST({ url }) {
  const action = (url.searchParams.get('action') as 'start' | 'stop' | 'restart') ?? 'start';
  const service = url.searchParams.get('service');
  if (!service) throw error(400, 'service is required');
  try {
    await containerAction(service, action);
    return new Response(null, { status: 204 });
  } catch (e: any) {
    throw error(500, e.message ?? 'Operation failed');
  }
}


