import { getDbClient } from '$lib/server/db';
import type { RequestHandler } from './$types';

type Row = { id: number; kind: 'State' | 'Event'; value: string; ts: number | null };

async function getLatest(kind: 'State' | 'Event'): Promise<Row | null> {
    const db = getDbClient();
    const table = kind === 'State' ? 'State' : 'Event';
    const column = kind === 'State' ? 'state' : 'event';
    try {
        const res = await db.execute({
            sql: `SELECT t.id AS id, t.${column} AS value, rf.timestamp_epoch AS ts
                  FROM ${table} t
                  JOIN RadioFrame rf ON rf.data_id = t.id AND rf.data_type = '${kind}'
                  ORDER BY rf.timestamp_epoch DESC
                  LIMIT 1`,
            args: []
        });
        if (res.rows.length) {
            const r = res.rows[0];
            return { id: Number(r.id), kind, value: String(r.value), ts: r.ts ? Number(r.ts) : null };
        }
    } catch (e) {
        console.error(`${kind} API: join query failed, falling back`, e);
    }
    try {
        const res2 = await db.execute({
            sql: `SELECT id, ${column} AS value FROM ${table} ORDER BY id DESC LIMIT 1`,
            args: []
        });
        if (res2.rows.length) {
            const r = res2.rows[0];
            return { id: Number(r.id), kind, value: String(r.value), ts: null };
        }
    } catch (e) {
        console.error(`${kind} API: fallback latest query failed`, e);
    }
    return null;
}

async function getSnapshot(limit = 50): Promise<Row[]> {
    const db = getDbClient();
    try {
        const stateRes = await db.execute({
            sql: `SELECT s.id AS id, s.state AS value, rf.timestamp_epoch AS ts, 'State' AS kind
                  FROM State s
                  JOIN RadioFrame rf ON rf.data_id = s.id AND rf.data_type = 'State'
                  ORDER BY rf.timestamp_epoch DESC
                  LIMIT ?`,
            args: [limit]
        });
        const eventRes = await db.execute({
            sql: `SELECT e.id AS id, e.event AS value, rf.timestamp_epoch AS ts, 'Event' AS kind
                  FROM Event e
                  JOIN RadioFrame rf ON rf.data_id = e.id AND rf.data_type = 'Event'
                  ORDER BY rf.timestamp_epoch DESC
                  LIMIT ?`,
            args: [limit]
        });
        const toRow = (r: any) => ({ id: Number(r.id), kind: r.kind as 'State' | 'Event', value: String(r.value), ts: r.ts ? Number(r.ts) : null });
        return [...stateRes.rows.map(toRow), ...eventRes.rows.map(toRow)]
            .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
            .slice(0, limit);
    } catch (e) {
        console.error('State API snapshot failed', e);
        return [];
    }
}

export const GET: RequestHandler = async ({ request }) => {
    let cancelled = false;
    let lastStateId: number | null = null;
    let lastEventId: number | null = null;
    let intervalId: any;

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const sendEvent = (event: string, payload: unknown) => {
                if (cancelled) return;
                const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
                controller.enqueue(encoder.encode(`event: ${event}\n` + `data: ${data}\n\n`));
            };

            const push = async () => {
                if (cancelled) return;
                const [s, e] = await Promise.all([getLatest('State'), getLatest('Event')]);
                const newRows: Row[] = [];
                if (s && (lastStateId === null || s.id !== lastStateId)) {
                    lastStateId = s.id;
                    newRows.push(s);
                }
                if (e && (lastEventId === null || e.id !== lastEventId)) {
                    lastEventId = e.id;
                    newRows.push(e);
                }
                if (newRows.length) {
                    newRows.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
                    sendEvent('append', newRows);
                }
            };

            // Initial snapshot
            getSnapshot(50).then((rows) => sendEvent('snapshot', rows));

            // Poll for new items
            intervalId = setInterval(push, 1000);

            request.signal.addEventListener('abort', () => {
                cancelled = true;
                clearInterval(intervalId);
            });
        },
        cancel() {
            cancelled = true;
            if (intervalId) clearInterval(intervalId);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive'
        }
    });
};


