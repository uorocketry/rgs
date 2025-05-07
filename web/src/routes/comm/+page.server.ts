import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch initial status from the Hydra Manager Daemon API endpoint
		const statusResponse = await fetch('http://127.0.0.1:3030/service/status');
		if (!statusResponse.ok) {
			console.error(`Failed to fetch initial service status: ${statusResponse.status}`);
			// Still try to fetch logs even if status fails, but log the error
		}
		const initialStatus = statusResponse.ok ? await statusResponse.json() : null;

		// Fetch initial logs from our SvelteKit logs API endpoint
		let initialLogs: string[] = [];
		let logsError: string | null = null;
		try {
			const logsApiResponse = await fetch('/comm/logs/api'); // Use SvelteKit's fetch for internal API routes
			if (logsApiResponse.ok) {
				const logsData = await logsApiResponse.json();
				initialLogs = logsData.logs || [];
			} else {
				logsError = `Failed to fetch initial logs: ${logsApiResponse.status}`;
				console.error(logsError);
			}
		} catch (logE) {
			logsError = logE instanceof Error ? logE.message : 'Unknown error fetching logs';
			console.error('Exception fetching initial logs:', logsError);
		}

		return {
			initialStatus,
			initialLogs,
			error: initialStatus ? null : (statusResponse.ok ? null : 'Failed to fetch initial service status'),
			logsError
		};
	} catch (e) {
		console.error('Overall error in load function:', e);
		return {
			initialStatus: null,
			initialLogs: [],
			error: e instanceof Error ? e.message : 'Failed to load initial page data',
			logsError: 'Failed to load initial logs due to an overall error'
		};
	}
};
