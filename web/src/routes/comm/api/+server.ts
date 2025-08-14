import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const DAEMON_URL = process.env.COMM_DAEMON_URL || 'http://127.0.0.1:3030';

export const GET: RequestHandler = async () => {
	// Proxy status
	try {
		const res = await fetch(`${DAEMON_URL}/service/status`);
		const data = await res.json();
		return json(data, { status: res.status });
	} catch (e: any) {
		return error(500, e.message || 'Failed to fetch status from daemon');
	}
};

export const POST: RequestHandler = async ({ request, url }) => {
	// Proxy start/stop
	const action = url.searchParams.get('action');
	let endpoint = '';
	if (action === 'start') {
		endpoint = '/service/start';
	} else if (action === 'stop') {
		endpoint = '/service/stop';
	} else {
		return error(400, 'Invalid action');
	}
	try {
		const res = await fetch(`${DAEMON_URL}${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: action === 'start' ? await request.text() : undefined
		});
		const data = await res.json();
		return json(data, { status: res.status });
	} catch (e: any) {
		return error(500, e.message || `Failed to ${action} service`);
	}
}; 