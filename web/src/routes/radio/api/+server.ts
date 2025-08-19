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
                        const metricsResult = await db.execute({
                            sql: `SELECT timestamp, rssi, packets_lost FROM RadioMetrics ORDER BY timestamp DESC LIMIT 20`,
                            args: []
                        });

                        // Try to use summary table if available; otherwise fall back to aggregate queries
                        let total_packets_lost = 0;
                        let total_radio_frames = 0;
                        try {
                            const summary = await db.execute({
                                sql: `SELECT total_packets_lost, total_radio_frames FROM MetricsSummary LIMIT 1`,
                                args: []
                            });
                            if (summary.rows.length > 0) {
                                const row: any = summary.rows[0];
                                total_packets_lost = Number(row.total_packets_lost ?? 0);
                                total_radio_frames = Number(row.total_radio_frames ?? 0);
                            }
                        } catch (_) {
                            // Fallback if table doesn't exist yet
                            const [lostAgg, frameAgg] = await Promise.all([
                                db.execute({ sql: `SELECT COALESCE(SUM(packets_lost), 0) AS total FROM RadioMetrics`, args: [] }),
                                db.execute({ sql: `SELECT COUNT(*) AS total FROM RadioFrame`, args: [] })
                            ]);
                            total_packets_lost = Number((lostAgg.rows[0] as any).total ?? 0);
                            total_radio_frames = Number((frameAgg.rows[0] as any).total ?? 0);
                        }

                        const packet_loss_ratio = total_radio_frames > 0 ? total_packets_lost / total_radio_frames : 0;
                        const packet_loss_percentage = packet_loss_ratio * 100;

                        if (cancelled) return;
                        sendEvent('metrics', {
                            metrics: metricsResult.rows,
                            totals: {
                                total_packets_lost,
                                total_radio_frames,
                                packet_loss_ratio,
                                packet_loss_percentage
                            }
                        });
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
    const metricsResult = await db.execute({
        sql: `SELECT timestamp, rssi, packets_lost FROM RadioMetrics ORDER BY timestamp DESC LIMIT 20`,
        args: []
    });

    // Summary (prefer summary table, fallback to aggregates)
    let total_packets_lost = 0;
    let total_radio_frames = 0;
    try {
        const summary = await db.execute({
            sql: `SELECT total_packets_lost, total_radio_frames FROM MetricsSummary LIMIT 1`,
            args: []
        });
        if (summary.rows.length > 0) {
            const row: any = summary.rows[0];
            total_packets_lost = Number(row.total_packets_lost ?? 0);
            total_radio_frames = Number(row.total_radio_frames ?? 0);
        }
    } catch (_) {
        const [lostAgg, frameAgg] = await Promise.all([
            db.execute({ sql: `SELECT COALESCE(SUM(packets_lost), 0) AS total FROM RadioMetrics`, args: [] }),
            db.execute({ sql: `SELECT COUNT(*) AS total FROM RadioFrame`, args: [] })
        ]);
        total_packets_lost = Number((lostAgg.rows[0] as any).total ?? 0);
        total_radio_frames = Number((frameAgg.rows[0] as any).total ?? 0);
    }

    const packet_loss_ratio = total_radio_frames > 0 ? total_packets_lost / total_radio_frames : 0;
    const packet_loss_percentage = packet_loss_ratio * 100;

    return json({
        metrics: metricsResult.rows,
        totals: {
            total_packets_lost,
            total_radio_frames,
            packet_loss_ratio,
            packet_loss_percentage
        }
    });
};
