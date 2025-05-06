// import { getDbClient } from '$lib/server/db';
// import type { Row } from '@libsql/client';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Keep the helper, it might be useful if we switch back later
// function quaternionToEuler(w: number, x: number, y: number, z: number): { roll: number; pitch: number; yaw: number } {
//     const roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)) * (180 / Math.PI);
//     const pitch = Math.asin(2 * (w * y - z * x)) * (180 / Math.PI);
//     const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) * (180 / Math.PI);
//     const heading = (yaw < 0) ? yaw + 360 : yaw;
//     return { roll, pitch, yaw: heading };
// }

export const GET: RequestHandler = async () => {
	// Simulate data using time
	const now = Date.now() / 1000; // Time in seconds

	// Parameters for oscillation (amplitude, frequency)
	// Use slower frequencies from previous state
	const pitchAmplitude = 15; // degrees
	const pitchFrequency = 0.1;
	const rollAmplitude = 30; // degrees
	const rollFrequency = 0.00008;
	// Keep heading simulation for potential future use
	const headingFrequency = 0.000005;
	// Keep position simulation for potential future use
	const startLat = 40.7128; // Example: NYC latitude
	const startLon = -74.0060; // Example: NYC longitude
	const driftSpeed = 0.0000000001;

	try {
		// Simulate aircraft attitude relative to horizon
		const simulatedPitch = pitchAmplitude * Math.sin(2 * Math.PI * pitchFrequency * now);
		const simulatedRoll = rollAmplitude * Math.sin(2 * Math.PI * rollFrequency * now);
		// Simulate heading and position (might be used later)
		const simulatedHeading = (180 + 180 * Math.sin(2 * Math.PI * headingFrequency * now)) % 360;
		const simulatedLatitude = startLat + driftSpeed * Math.cos(now * 0.1) * (now * 0.1);
		const simulatedLongitude = startLon + driftSpeed * Math.sin(now * 0.1) * (now * 0.1);

		const pfdData = {
			pitch: simulatedPitch,
			roll: simulatedRoll,
			heading: simulatedHeading,
			airspeed: 120 + 10 * Math.sin(2 * Math.PI * 0.03 * now), // Keep simulating other values
			altitude: 1500 + 100 * Math.sin(2 * Math.PI * 0.02 * now),
			latitude: simulatedLatitude,
			longitude: simulatedLongitude
		};

		return json(pfdData);

	} catch (e: any) {
		console.error("Error in PFD API GET handler (Simulation):", e);
		throw error(500, `Failed to generate simulated PFD data: ${e.message}`);
	}
}; 