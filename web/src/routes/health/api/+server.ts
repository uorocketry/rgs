import { json, error } from "@sveltejs/kit";
import { getDbClient } from '$lib/server/db'; // Import the shared DB client
// import { LIBSQL_URL } from '$env/static/private';

// Basic check for environment variables
// if (!LIBSQL_URL) {
// 	throw new Error("Missing required environment variable: LIBSQL_URL");
// }
const LIBSQL_URL = "http://localhost:8080";

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
export async function GET({ url }) {
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

	try {
		console.log(`Fetching health data: latest pings and ${HISTORY_MINUTES}m history (${NUM_HISTORY_BUCKETS} buckets)...`);

		// Execute both queries in parallel
		const [latestPingResult, historyResult] = await Promise.all([
			db.execute({
				sql: latestPingSql,
				args: [nowTimestamp, OPERATIONAL_THRESHOLD_SECONDS]
			}),
			db.execute({
				sql: historySql,
				args: [historyStartTime, BUCKET_DURATION_SECONDS, historyStartTime, nowTimestamp]
			})
		]);

		console.log(`Found ${latestPingResult.rows.length} distinct services with recent pings.`);
		console.log(`Found ${historyResult.rows.length} historical ping bucket entries.`);

		// Process results
		const serviceDataMap = new Map<string, HealthServiceHistory>();

		// 1. Populate map with latest ping data and determine current status
		for (const row of latestPingResult.rows) {
			const serviceId = row.service_id as string;
			const dbTimestamp = row.db_timestamp as number;
			let status: HealthServiceHistory['status'] = 'Outage'; // Assume outage initially

			if (dbTimestamp >= (nowTimestamp - OPERATIONAL_THRESHOLD_SECONDS)) {
				status = 'Operational';
			}

			serviceDataMap.set(serviceId, {
				service_id: serviceId,
				hostname: row.hostname as string | null,
				latest_app_timestamp: row.app_timestamp as number,
				latest_db_timestamp: dbTimestamp,
				latency_secs: row.latency_secs as number,
				status: status,
				history: Array(NUM_HISTORY_BUCKETS).fill(false) // Initialize history
			});
		}

		// 2. Fill in history data from the second query
		for (const row of historyResult.rows) {
			const serviceId = row.service_id as string;
			const bucketIndex = row.bucket_index_from_start as number;

			if (serviceDataMap.has(serviceId)) {
				const serviceEntry = serviceDataMap.get(serviceId)!;
				if (bucketIndex >= 0 && bucketIndex < NUM_HISTORY_BUCKETS) {
					// Ensure bucket index is valid before assigning
					serviceEntry.history[bucketIndex] = true; // Mark bucket as having pings
				}
			}
			// else: If a service only has historical pings but no *recent* one,
			// it won't be in the map from step 1, so we ignore its history for now.
			// You could adapt this to show services with only old history if needed.
		}

		// Convert map values to array for the response
		const servicesResult = Array.from(serviceDataMap.values());

		const responsePayload: HealthApiResponse = {
			checkTime: new Date().toISOString(),
			parameters: {
				historyMinutes: HISTORY_MINUTES,
				numBuckets: NUM_HISTORY_BUCKETS,
				bucketDurationSeconds: BUCKET_DURATION_SECONDS,
				operationalThresholdSeconds: OPERATIONAL_THRESHOLD_SECONDS
			},
			services: servicesResult
		};

		return json(responsePayload);

	} catch (e: any) {
		console.error("Failed to fetch service pings:", e);
		throw error(500, `Database query failed: ${e.message}`);
	}
} 