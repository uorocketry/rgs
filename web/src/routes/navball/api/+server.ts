import type { RequestHandler } from './$types';
import { getDbClient } from '$lib/server/db';

// Module-scope state
let latestImuData: any = {
	time_stamp: Math.floor(Date.now() / 1000),
	status: 'INITIALIZING',
	accelerometer_x: 0, accelerometer_y: 0, accelerometer_z: 9.81,
	gyroscope_x: 0, gyroscope_y: 0, gyroscope_z: 0,
	delta_velocity_x: 0, delta_velocity_y: 0, delta_velocity_z: 0,
	delta_angle_x: 0, delta_angle_y: 0, delta_angle_z: 0,
	temperature: 25
};
const activeControllers = new Set<ReadableStreamDefaultController>();
let dbPollingIntervalId: NodeJS.Timeout | null = null;
const DB_POLL_INTERVAL_MS = 100;

const db = getDbClient(); // Initialize DB client once

async function fetchAndUpdateImuData() {
	try {
		const result = await db.execute({
			sql: `SELECT * FROM SbgImu ORDER BY time_stamp DESC LIMIT 1`,
		});
		if (!result.rows.length) {
			latestImuData = {
				time_stamp: Math.floor(Date.now() / 1000),
				status: 'NO_DATA',
				accelerometer_x: 0, accelerometer_y: 0, accelerometer_z: 9.81,
				gyroscope_x: 0, gyroscope_y: 0, gyroscope_z: 0,
				delta_velocity_x: 0, delta_velocity_y: 0, delta_velocity_z: 0,
				delta_angle_x: 0, delta_angle_y: 0, delta_angle_z: 0,
				temperature: 25
			};
		} else {
			latestImuData = result.rows[0];
		}
	} catch (e: any) {
		console.error("Error fetching IMU data in central poller:", e);
		latestImuData = { ...latestImuData, status: 'DB_ERROR', errorDetails: e.message };
	}

	// Broadcast to all active clients
	const message = `data: ${JSON.stringify(latestImuData)}\n\n`;
	activeControllers.forEach(controller => {
		try {
			controller.enqueue(message);
		} catch (err) {
			console.warn("Error enqueuing data to a client, removing controller:", err);
			try { controller.close(); } catch { }
			activeControllers.delete(controller);
		}
	});
}

// Perform an initial fetch when the module loads
fetchAndUpdateImuData();

// Start polling the database if not already started
if (!dbPollingIntervalId) {
	dbPollingIntervalId = setInterval(fetchAndUpdateImuData, DB_POLL_INTERVAL_MS);
	console.log(`Central IMU data polling started every ${DB_POLL_INTERVAL_MS}ms.`);
}

export const GET: RequestHandler = ({ request }) => {
	let streamScopedController: ReadableStreamDefaultController;

	const stream = new ReadableStream({
		start(controller) {
			streamScopedController = controller; // Assign to the GET handler's scope
			activeControllers.add(streamScopedController);
			console.log('SSE client connected. Total clients:', activeControllers.size);

			try {
				streamScopedController.enqueue(`data: ${JSON.stringify(latestImuData)}\n\n`);
			} catch (e) {
				console.error("Error sending initial data to new client, client might have disconnected:", e);
				activeControllers.delete(streamScopedController);
				try { streamScopedController.close(); } catch { }
				return;
			}
		},
		cancel() {
			if (streamScopedController) { // Check if it was assigned
				activeControllers.delete(streamScopedController);
			}
			console.log('SSE client disconnected. Total clients:', activeControllers.size);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
}; 