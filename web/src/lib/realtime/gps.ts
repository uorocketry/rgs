import type { LatLngLiteral } from 'leaflet';
import { latestCollectionWritable } from './lastestCollectionWritable';
import { defaultLaunchCoords, defaultRelativeAltitude } from './flightDirector';
import { Vector3 } from 'three';

export const rocketPosition = latestCollectionWritable<LatLngLiteral>(
	'GpsPos1',
	defaultLaunchCoords,
	(row) => {
		return {
			lat: row.latitude,
			lng: row.longitude
		};
	}
);

/**
 * In meters
 */
export const rocketPositionAccuracyRadius = latestCollectionWritable<number>(
	'GpsPos2',
	0,
	(row) => {
		return Math.max(row.latitudeAccuracy, row.longitudeAccuracy);
	}
);

/**
 * In meters relative to sea level
 */
export const rocketAltitude = latestCollectionWritable<number>(
	'GpsPos1',
	defaultRelativeAltitude,
	(row) => {
		return row.altitude;
	}
);

/**
 * In meters
 */
export const rocketAltitudeAccuracy = latestCollectionWritable<number>('GpsPos2', 0, (row) => {
	return row.altitudeAccuracy;
});

/**
 * GPS North, East, Down velocity in m.s^-1.
 */
export const rocketVelocity = latestCollectionWritable<Vector3>('GpsVel', new Vector3(), (row) => {
	return new Vector3(row.velocity_0, row.velocity_1, row.velocity_2);
});

export const rocketVelocityAccuracy = latestCollectionWritable<Vector3>(
	'GpsVel',
	new Vector3(),
	(row) => {
		return new Vector3(row.velocity_acc_0, row.velocity_acc_1, row.velocity_acc_2);
	}
);

export const rocketCourse = latestCollectionWritable<number>('GpsVel', 0, (row) => {
	return row.course;
});

export const rocketCourseAccuracy = latestCollectionWritable<number>('GpsVel', 0, (row) => {
	return row.courseAccuracy;
});
