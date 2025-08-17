import type { RequestHandler } from './$types';
import { getDbClient } from '$lib/server/db';

// Module-scope state
let latestQuatData: any = {
	time_stamp: Math.floor(Date.now() / 1000),
	status: 'INITIALIZING',
	quaternion_w: 1,
	quaternion_x: 0,
	quaternion_y: 0,
	quaternion_z: 0
};
const activeControllers = new Set<ReadableStreamDefaultController>();
let dbPollingIntervalId: NodeJS.Timeout | null = null;
const DB_POLL_INTERVAL_MS = 500;

const db = getDbClient(); // Initialize DB client once

async function fetchAndUpdateQuatData() {
	try {
		const result = await db.execute({
			sql: `SELECT time_stamp, quaternion_w, quaternion_x, quaternion_y, quaternion_z, status FROM SbgEkfQuat ORDER BY id DESC LIMIT 1`,
		});
		if (!result.rows.length) {
			latestQuatData = {
				time_stamp: Math.floor(Date.now() / 1000),
				status: 'NO_DATA',
				quaternion_w: 1,
				quaternion_x: 0,
				quaternion_y: 0,
				quaternion_z: 0
			};
		} else {
			latestQuatData = result.rows[0];
		}
	} catch (e: any) {
		console.error("Error fetching EKF quaternion in central poller:", e);
		latestQuatData = { ...latestQuatData, status: 'DB_ERROR', errorDetails: e.message };
	}

	// Broadcast to all active clients
	const message = `data: ${JSON.stringify(latestQuatData)}\n\n`;
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
fetchAndUpdateQuatData();

// Start polling the database if not already started
if (!dbPollingIntervalId) {
	dbPollingIntervalId = setInterval(fetchAndUpdateQuatData, DB_POLL_INTERVAL_MS);
	console.log(`Central EKF quaternion polling started every ${DB_POLL_INTERVAL_MS}ms.`);
}

export const GET: RequestHandler = ({ request }) => {
	let streamScopedController: ReadableStreamDefaultController;

	const stream = new ReadableStream({
		start(controller) {
			streamScopedController = controller; // Assign to the GET handler's scope
			activeControllers.add(streamScopedController);
			console.log('SSE client connected. Total clients:', activeControllers.size);

			try {
				streamScopedController.enqueue(`data: ${JSON.stringify(latestQuatData)}\n\n`);
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