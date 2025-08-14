import { getDbClient } from '$lib/server/db';
import type { RequestHandler } from './$types';

type MetricMap = { table: string; t: string; v: string };

function metricToMap(metric: string): MetricMap | null {
    switch (metric) {
        case 'radio_rssi':
            return { table: 'RadioMetrics', t: 'timestamp', v: 'rssi' };
        case 'radio_packets_lost':
            return { table: 'RadioMetrics', t: 'timestamp', v: 'packets_lost' };
        case 'sbg_altitude':
            return { table: 'SbgAir', t: 'time_stamp', v: 'altitude' };
        case 'sbg_temperature':
            return { table: 'SbgAir', t: 'time_stamp', v: 'air_temperature' };
        default:
            return null;
    }
}

export const GET: RequestHandler = async ({ url, request }) => {
    const metric = url.searchParams.get('metric') ?? 'radio_rssi';
    const limit = Math.max(10, Math.min(5000, Number(url.searchParams.get('limit') ?? 200)));
    const pollMs = Math.max(250, Math.min(5000, Number(url.searchParams.get('interval') ?? 1000)));

    const map = metricToMap(metric);
    if (!map) return new Response('Unknown metric', { status: 400 });

    const db = getDbClient();
    const { table, t, v } = map;

    // hoisted state so start() and cancel() can both see it
    let isClosed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastT = 0;
    let controllerRef: ReadableStreamDefaultController<string> | null = null;

    function cleanup() {
        if (isClosed) return;
        isClosed = true;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        try {
            controllerRef?.close(); // ok to call multiple times; ignore if already closed
        } catch { /* ignore */ }
    }

    const stream = new ReadableStream<string>({
        async start(controller) {
            controllerRef = controller;

            // flush headers and keep-alive comment (some proxies like to see initial bytes)
            if (!isClosed) controller.enqueue(': connected\n\n');

            const onAbort = () => cleanup();
            request.signal.addEventListener('abort', onAbort);

            async function sendInitial() {
                try {
                    console.log('sending initial');
                    const res = await db.execute({
                        sql: `SELECT ${t} AS t, ${v} AS v FROM ${table} ORDER BY ${t} DESC LIMIT ?`,
                        args: [limit]
                    });
                    const rows = [...res.rows].reverse();
                    for (const row of rows) {
                        if (isClosed) return;
                        const payload = JSON.stringify({ t: row.t, v: row.v });
                        controller.enqueue(`data: ${payload}\n\n`);
                        if (Number(row.t) > lastT) lastT = Number(row.t);
                    }
                } catch (e) {
                    console.error('initial query failed', e);
                    if (!isClosed) controller.enqueue(`event: error\ndata: ${JSON.stringify({ message: 'initial query failed' })}\n\n`);
                }
            }

            async function tick() {
                if (isClosed) return;
                try {
                    const res = await db.execute({
                        sql: `SELECT ${t} AS t, ${v} AS v FROM ${table} WHERE ${t} > ? ORDER BY ${t} ASC LIMIT ?`,
                        args: [lastT, 100]
                    });
                    for (const row of res.rows) {
                        if (isClosed) return;
                        const payload = JSON.stringify({ t: row.t, v: row.v });
                        controller.enqueue(`data: ${payload}\n\n`);
                        if (Number(row.t) > lastT) lastT = Number(row.t);
                    }
                } catch {
                    if (!isClosed) controller.enqueue(`event: error\ndata: ${JSON.stringify({ message: 'poll failed' })}\n\n`);
                } finally {
                    if (!isClosed) timer = setTimeout(tick, pollMs);
                }
            }

            await sendInitial();
            if (!isClosed) timer = setTimeout(tick, pollMs);
        },

        // called when client disconnects or the Response is GC'ed/canceled
        cancel() {
            cleanup();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            // SvelteKit often serves over HTTP/2; 'Connection: keep-alive' is harmless but not required.
        }
    });
};
