import { getDbClient } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, request }) => {
    const useSSE = url.searchParams.get('sse') === '1';

    if (useSSE) {
        // SSE stream for real-time radio metrics updates
        let cancelled = false;
        let intervalId: any;

        const stream = new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();

                function sendEvent(event: string, payload: unknown) {
                    if (cancelled) return;
                    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
                    const chunk = `event: ${event}\n` + `data: ${data}\n\n`;
                    controller.enqueue(encoder.encode(chunk));
                }

                const push = async () => {
                    if (cancelled) return;
                    try {
                        const db = getDbClient();
                        const result = await db.execute({
                            sql: `SELECT timestamp, rssi, packets_lost FROM RadioMetrics ORDER BY timestamp DESC LIMIT 20`,
                            args: []
                        });

                        if (cancelled) return;
                        sendEvent('metrics', result.rows);
                    } catch (e) {
                        sendEvent('error', { message: 'Failed to fetch radio metrics' });
                        console.error('SSE push error:', e);
                    }
                };

                // Initial push immediately, then interval
                push();
                intervalId = setInterval(push, 5000);

                // Close stream on client disconnect
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
                'Connection': 'keep-alive'
            }
        });
    }

    // Regular GET request
    const db = getDbClient();
    const result = await db.execute({
        sql: `SELECT timestamp, rssi, packets_lost FROM RadioMetrics ORDER BY timestamp DESC LIMIT 20`,
        args: []
    });
    return json(result.rows);
};
