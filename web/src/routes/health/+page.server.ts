import { error, type NumericRange } from '@sveltejs/kit';
import type { HttpError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// This function runs on the server when the /health page is requested.
export const load: PageServerLoad = async ({ fetch }) => {
	console.log('Fetching initial health data on server...');
	try {
		// Use the built-in fetch to call our own API endpoint
		const response = await fetch('/health/api');

		if (!response.ok) {
			// Log the error status and text for server-side debugging
			const errorText = await response.json();
			console.error(`Failed to fetch initial health data: ${response.status} ${response.statusText}`, errorText);
			// Ensure status is in the valid range for SvelteKit's error helper
			let status: NumericRange<400, 599> = 500;
			if (response.status >= 400 && response.status <= 599) {
				status = response.status as NumericRange<400, 599>;
			}
			// Throw a SvelteKit error that will be handled by the error page
			throw error(status, errorText.message);
		}

		const healthData = await response.json();
		console.log('Initial health data fetched successfully.');
		return {
			initialHealthData: healthData
		};
	} catch (e: any) {
		console.error("Error in health page load function:", e);
		// Catch fetch errors or errors thrown from !response.ok
		// If it's already a SvelteKit HttpError, re-throw it, otherwise create a 500 error
		const httpError = e as HttpError;
		if (httpError.status) { // Check if it's a SvelteKit HttpError by looking for status
			throw e;
		}
		throw error(500, `Server error fetching health data: ${e.message}`);
	}
}; 