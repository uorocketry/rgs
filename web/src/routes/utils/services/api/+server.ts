import { error, json } from '@sveltejs/kit';
import http from 'node:http';
import type { IncomingMessage } from 'node:http';

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
      status: (c.State as ComposeServiceStatus) ?? 'unknown'
    }));
}

async function containerAction(service: string, action: 'start' | 'stop' | 'restart') {
  // service is container name as shown in compose: e.g., rgs-web-1
  let path = `/containers/${service}/${action}`;
  if (action === 'restart') path += '?t=5';
  const res = await dockerRequest(path, 'POST');
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


