import { haversineDistance, max } from '$lib/common/utils';
import type { Readable } from 'svelte/motion';
import { derived } from 'svelte/store';
import { flightDirector } from './flightDirector';
import { rocketPos } from './gps';
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
		return ($air?.altitude ?? 0) - ($flightDirector?.relativeAltitude ?? 0);
	}
);

// $: distance_from_target = $flightDirector.targetAltitude - $ground_altitude;
export const distance_from_target: Readable<number> = derived(
	[flightDirector, ground_altitude],
	([$flightDirector, $ground_altitude]) => {
		return ($flightDirector?.targetAltitude ?? 0) - $ground_altitude;
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
	[rocketPos],
	([$rocketPos]) => {
		const x = [1, 2, 3];
		x.length;
		return {
			0: $rocketPos.latitude ?? 0,
			1: $rocketPos.longitude ?? 0,
			2: $rocketPos.altitude ?? 0,
			length: 3,
			lat: $rocketPos.latitude ?? 0,
			lng: $rocketPos.longitude ?? 0,
			altitude: $rocketPos.altitude ?? 0
		} satisfies CurrentPositionType;
	}
);

// $: total_traveled_distance = haversineDistance($rocketPosition, $launchPoint);
export const total_traveled_distance: Readable<number> = derived(
	[rocketPos, flightDirector],
	([$rocketPos, $flightDirector]) => {
		return haversineDistance(
			{ lat: $rocketPos?.latitude ?? 0, lng: $rocketPos?.longitude ?? 0 },
			{ lat: $flightDirector?.latitude ?? 0, lng: $flightDirector?.longitude ?? 0 }
		);
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
