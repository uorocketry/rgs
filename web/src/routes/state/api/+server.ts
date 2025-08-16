import { getDbClient } from '$lib/server/db';
import type { RequestHandler } from './$types';

async function getLatestState() {
    const db = getDbClient();
    // Prefer joining RadioFrame for a reliable timestamp. Fallback to plain State if join fails.
    try {
        const res = await db.execute({
            sql: `SELECT s.id AS id, s.state AS state, rf.timestamp_epoch AS ts
                  FROM State s
                  JOIN RadioFrame rf ON rf.data_id = s.id AND rf.data_type = 'State'
                  ORDER BY rf.timestamp_epoch DESC
                  LIMIT 1`,
            args: []
        });
        if (res.rows.length) return res.rows[0];
    } catch (e) {
        console.error('State API: join query failed, falling back to State-only query', e);
    }

    try {
        const res2 = await db.execute({
            sql: `SELECT id, state, NULL AS ts FROM State ORDER BY id DESC LIMIT 1`,
            args: []
        });
        return res2.rows.length ? res2.rows[0] : null;
    } catch (e) {
        console.error('State API: fallback query failed', e);
        return null;
    }
}

export const GET: RequestHandler = async ({ request }) => {
    let cancelled = false;
    let lastId: number | null = null;
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
                const row = await getLatestState();
                if (!row) return;
                const id = Number(row.id);
                if (lastId === null || id !== lastId) {
                    lastId = id;
                    const payload = {
                        id,
                        state: row.state as string,
                        ts: row.ts ? Number(row.ts) : null
                    };
                    sendEvent('state', payload);
                }
            };

            // Initial emit, then poll
            push();
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


