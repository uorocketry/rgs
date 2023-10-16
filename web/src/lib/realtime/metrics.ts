import { haversineDistance, max } from '$lib/common/utils';
import type { Readable } from 'svelte/motion';
import { derived } from 'svelte/store';
import { flightDirector, launchPoint } from './flightDirector';
import { rocketAltitude, rocketPosition } from './gps';
import { air, ekf } from './linkStatus';

const _velocity = [0, 0, 0];
export const max_velocity: Readable<[number, number, number]> = derived([ekf], ([$ekf]) => {
	if ($ekf.velocity) {
		return [
			max(_velocity[0], $ekf.velocity[0]),
			max(_velocity[1], $ekf.velocity[1]),
			max(_velocity[2], $ekf.velocity[2])
		] satisfies [number, number, number];
	} else {
		return [0, 0, 0] satisfies [number, number, number];
	}
});

// ground_altitude = ($air?.altitude ?? 0) - $flightDirector.relativeAltitude;
export const ground_altitude: Readable<number> = derived(
	[flightDirector, air],
	([$flightDirector, $air]) => {
		return ($air?.altitude ?? 0) - $flightDirector.relativeAltitude;
	}
);

// $: distance_from_target = $flightDirector.targetAltitude - $ground_altitude;
export const distance_from_target: Readable<number> = derived(
	[flightDirector, ground_altitude],
	([$flightDirector, $ground_altitude]) => {
		return $flightDirector.targetAltitude - $ground_altitude;
	}
);

// $: max_altitude = max(max_altitude, $air?.altitude ?? 0);
const _max_altitude = 0;
export const max_altitude: Readable<number> = derived(air, ($air) => {
	return max(_max_altitude, $air?.altitude ?? 0);
});

type CurrentPositionType = ArrayLike<number> & { lat: number; lng: number; altitude: number };
// $: current_position = [$rocketPosition.lat, $rocketPosition.lng, $rocketAltitude];
export const current_position: Readable<CurrentPositionType> = derived(
	[rocketPosition, rocketAltitude],
	([$rocketPosition, $rocketAltitude]) => {
		const x = [1, 2, 3];
		x.length;
		return {
			0: $rocketPosition.lat,
			1: $rocketPosition.lng,
			2: $rocketAltitude,
			length: 3,
			lat: $rocketPosition.lat,
			lng: $rocketPosition.lng,
			altitude: $rocketAltitude
		} satisfies CurrentPositionType;
	}
);

// $: total_traveled_distance = haversineDistance($rocketPosition, $launchPoint);
export const total_traveled_distance: Readable<number> = derived(
	[rocketPosition, launchPoint],
	([$rocketPosition, $launchPoint]) => {
		return haversineDistance($rocketPosition, $launchPoint);
	}
);

function calcGForce(vf: number, t: number) {
	return vf / (t * 9.81);
}

// FIXME: The G-Force calculation is wrong since it's not given a proper time delta
export const g_force: Readable<number> = derived(ekf, ($ekf) => {
	if ($ekf.velocity) {
		return calcGForce($ekf.velocity[1], 0.1);
	}
	return 0;
});

const _g_force = 0;
export const max_g_force: Readable<number> = derived(g_force, ($g_force) => {
	return max($g_force, _g_force);
});
