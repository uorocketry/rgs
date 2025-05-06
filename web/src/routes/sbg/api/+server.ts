import { getDbClient } from '$lib/server/db';
import { json, error } from '@sveltejs/kit';
import type { Row } from '@libsql/client';
import type { RequestHandler } from './$types';

// Re-use the helper function (could be moved to a shared lib if used elsewhere too)
async function getLatestRow(tableName: string): Promise<Row | null> {
	const db = getDbClient();
	try {
		const result = await db.execute({
			sql: `SELECT * FROM ${tableName} ORDER BY time_stamp DESC LIMIT 1`,
			args: []
		});
		return result.rows.length > 0 ? result.rows[0] : null;
	} catch (e: any) {
		console.error(`Error fetching latest row from ${tableName} for API:`, e);
		return null;
	}
}

export const GET: RequestHandler = async () => {
	console.log("API request received for latest SBG data...");

	try {
		// Fetch latest data in parallel
		const [
			latestUtcTime,
			latestAir,
			latestEkfQuat,
			latestEkfNav,
			latestImu,
			latestGpsVel,
			latestGpsPos
		] = await Promise.all([
			getLatestRow('SbgUtcTime'),
			getLatestRow('SbgAir'),
			getLatestRow('SbgEkfQuat'),
			getLatestRow('SbgEkfNav'),
			getLatestRow('SbgImu'),
			getLatestRow('SbgGpsVel'),
			getLatestRow('SbgGpsPos')
		]);

		console.log("API finished fetching SBG data.");

		// Structure the response data
		const responseData = {
			utcTime: latestUtcTime ?? {},
			air: latestAir ?? {},
			ekfQuat: latestEkfQuat ?? {},
			ekfNav: latestEkfNav ?? {},
			imu: latestImu ?? {},
			gpsVel: latestGpsVel ?? {},
			gpsPos: latestGpsPos ?? {},
		};

		return json(responseData);

	} catch (e: any) {
		// Catch any unexpected errors during the parallel fetch or processing
		console.error("Error in SBG API GET handler:", e);
		throw error(500, `Failed to fetch SBG data: ${e.message}`);
	}
}; 