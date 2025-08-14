import { getDbClient } from '$lib/server/db'; // Import the shared DB client
import { error, json } from "@sveltejs/kit";

// --- Configuration for History ---
const HISTORY_MINUTES = 10;
const NUM_HISTORY_BUCKETS = 20;
const BUCKET_DURATION_SECONDS = (HISTORY_MINUTES * 60) / NUM_HISTORY_BUCKETS;
// How many seconds old can the *latest* ping be for current status check
const OPERATIONAL_THRESHOLD_SECONDS = 90;
// --- End Configuration ---

// --- Types for API Response ---
interface HealthServiceHistory {
	service_id: string;
	hostname: string | null;
	latest_app_timestamp: number | null;
	latest_db_timestamp: number | null;
	latency_secs: number | null;
	status: 'Operational' | 'Outage' | 'Unknown'; // Based on latest ping
	history: boolean[]; // Array of NUM_HISTORY_BUCKETS booleans, oldest to newest
}

interface HealthApiResponse {
	checkTime: string;
	parameters: {
		historyMinutes: number;
		numBuckets: number;
		bucketDurationSeconds: number;
		operationalThresholdSeconds: number;
	};
	services: HealthServiceHistory[];
}
// ---------------------------

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, request }) {
    const sse = url.searchParams.get('sse') === '1';
	const db = getDbClient();
	const nowTimestamp = Math.floor(Date.now() / 1000);
	const historyStartTime = nowTimestamp - (HISTORY_MINUTES * 60);

	// --- Query 1: Get LATEST ping for current status ---
	const latestPingSql = `
        WITH LatestPings AS (
            SELECT
                service_id,
                MAX(db_timestamp) AS max_db_timestamp
            FROM
                ServicePing
            WHERE
                 -- Look slightly beyond operational threshold to catch recent outages
                db_timestamp >= (? - ? * 2) 
            GROUP BY
                service_id
        )
        SELECT
            sp.id,
            sp.service_id,
            sp.hostname,
            sp.app_timestamp,
            sp.db_timestamp,
            (sp.db_timestamp - sp.app_timestamp) AS latency_secs
        FROM
            ServicePing sp
        JOIN
            LatestPings lp ON sp.service_id = lp.service_id AND sp.db_timestamp = lp.max_db_timestamp
        ORDER BY
            sp.service_id;
    `;

	// --- Query 2: Get HISTORICAL ping presence in buckets ---
	// This query finds *if* a ping exists in each bucket for each service.
	const historySql = `
        SELECT
            service_id,
            -- Calculate bucket index relative to the start of the history window
            -- Ensures stable buckets even if query runs slightly delayed
            CAST((
                (db_timestamp - ?) / ? 
            ) AS INTEGER) AS bucket_index_from_start, 
            COUNT(*) as ping_count -- We only care that count > 0
        FROM
            ServicePing
        WHERE
            db_timestamp >= ? -- Start of history window
            AND db_timestamp < ?  -- End of history window (now)
        GROUP BY
            service_id,
            bucket_index_from_start
        ORDER BY
            service_id, bucket_index_from_start;
    `;

    async function fetchPayload(): Promise<HealthApiResponse> {
        const now = Math.floor(Date.now() / 1000);
        const start = now - (HISTORY_MINUTES * 60);

        const [latestPingResult, historyResult] = await Promise.all([
            db.execute({ sql: latestPingSql, args: [now, OPERATIONAL_THRESHOLD_SECONDS] }),
            db.execute({ sql: historySql, args: [start, BUCKET_DURATION_SECONDS, start, now] })
        ]);

        const serviceDataMap = new Map<string, HealthServiceHistory>();
        for (const row of latestPingResult.rows) {
            const serviceId = row.service_id as string;
            const dbTimestamp = row.db_timestamp as number;
            let status: HealthServiceHistory['status'] = 'Outage';
            if (dbTimestamp >= (now - OPERATIONAL_THRESHOLD_SECONDS)) status = 'Operational';
            serviceDataMap.set(serviceId, {
                service_id: serviceId,
                hostname: row.hostname as string | null,
                latest_app_timestamp: row.app_timestamp as number,
                latest_db_timestamp: dbTimestamp,
                latency_secs: row.latency_secs as number,
                status,
                history: Array(NUM_HISTORY_BUCKETS).fill(false)
            });
        }
        for (const row of historyResult.rows) {
            const serviceId = row.service_id as string;
            const bucketIndex = row.bucket_index_from_start as number;
            const entry = serviceDataMap.get(serviceId);
            if (entry && bucketIndex >= 0 && bucketIndex < NUM_HISTORY_BUCKETS) {
                entry.history[bucketIndex] = true;
            }
        }
        const servicesResult = Array.from(serviceDataMap.values());
        return {
            checkTime: new Date().toISOString(),
            parameters: {
                historyMinutes: HISTORY_MINUTES,
                numBuckets: NUM_HISTORY_BUCKETS,
                bucketDurationSeconds: BUCKET_DURATION_SECONDS,
                operationalThresholdSeconds: OPERATIONAL_THRESHOLD_SECONDS
            },
            services: servicesResult
        };
    }

    if (sse) {
        let cancelled = false;
        let intervalId: any;
        const stream = new ReadableStream({
            async start(controller) {
                const enc = new TextEncoder();
                const send = (event: string, data: unknown) => {
                    if (cancelled) return;
                    const chunk = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
                    controller.enqueue(enc.encode(chunk));
                };
                const push = async () => {
                    if (cancelled) return;
                    try {
                        const payload = await fetchPayload();
                        send('health', payload);
                    } catch (e) {
                        send('error', { message: 'Failed to fetch health payload' });
                    }
                };
                await push();
                // Stream updates every 5 seconds
                intervalId = setInterval(push, 5000);
                request.signal.addEventListener('abort', () => {
                    cancelled = true;
                    if (intervalId) clearInterval(intervalId);
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
    }

    try {
        const payload = await fetchPayload();
        return json(payload);
    } catch (e: any) {
        console.error("Failed to fetch service pings:", e);
        throw error(500, `Database query failed: ${e.message}`);
    }
} 