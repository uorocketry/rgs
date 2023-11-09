import { derived } from 'svelte/store';
import { Vector3 } from 'three';
import { Collections } from '../common/pocketbase-types';
import { defaultRelativeAltitude } from './flightDirector';
import { latestCollectionWritable } from './lastestCollectionWritable';

export const gpsPos1 = latestCollectionWritable(Collections.GpsPos1);
export const gpsPos2 = latestCollectionWritable(Collections.GpsPos2);
export const gpsVel = latestCollectionWritable(Collections.GpsVel);

export const rocketPosition = derived([gpsPos1], ([$gpsPos1]) => {
	return {
		lat: $gpsPos1?.latitude ?? 0,
		lng: $gpsPos1?.longitude ?? 0
	};
});

/**
 * In meters
 */
export const rocketPositionAccuracyRadius = derived([gpsPos2], ([$gpsPos2]) => {
	return Math.max($gpsPos2?.latitudeAccuracy ?? 0, $gpsPos2?.longitudeAccuracy ?? 0);
});

/**
 * In meters relative to sea level
 */
export const rocketAltitude = derived([gpsPos1], ([$gpsPos1]) => {
	return $gpsPos1?.altitude ?? defaultRelativeAltitude;
});

/**
 * In meters
 */
export const rocketAltitudeAccuracy = derived([gpsPos2], ([$gpsPos2]) => {
	return $gpsPos2?.altitudeAccuracy ?? 0;
});

/**
 * GPS North, East, Down velocity in m.s^-1.
 */
export const rocketVelocity = derived([gpsVel], ([$gpsVel]) => {
	return new Vector3($gpsVel?.velocity_0 ?? 0, $gpsVel?.velocity_1 ?? 0, $gpsVel?.velocity_2 ?? 0);
});

export const rocketVelocityAccuracy = derived([gpsVel], ([$gpsVel]) => {
	return new Vector3(
		$gpsVel?.velocity_acc_0 ?? 0,
		$gpsVel?.velocity_acc_1 ?? 0,
		$gpsVel?.velocity_acc_2 ?? 0
	);
});

export const rocketCourse = derived([gpsVel], ([$gpsVel]) => {
	return $gpsVel?.course ?? 0;
});

export const rocketCourseAccuracy = derived([gpsVel], ([$gpsVel]) => {
	return $gpsVel?.course_acc ?? 0;
});
