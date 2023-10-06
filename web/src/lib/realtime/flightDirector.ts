import type { LatLngLiteral } from 'leaflet';
import { latestCollectionWritable } from './lastestCollectionWritable';

export const defaultLaunchCoordinates = [47.98714, -81.84864];
export const defaultLaunchCoords = {
	lat: defaultLaunchCoordinates[0],
	lng: defaultLaunchCoordinates[1]
};

export const launchPoint = latestCollectionWritable<LatLngLiteral>(
	'FlightDirector',
	defaultLaunchCoords,
	(row) => {
		return {
			lat: row.latitude,
			lng: row.longitude
		};
	}
);

export const defaultTargetAltitude = 7000;
export const defaultRelativeAltitude = 360;

type FlightDirector = {
	latitude: number;
	longitude: number;
	targetAltitude: number;
	relativeAltitude: number;
};

export const flightDirector = latestCollectionWritable<FlightDirector>(
	'FlightDirector',
	{
		latitude: defaultLaunchCoordinates[0],
		longitude: defaultLaunchCoordinates[1],
		targetAltitude: defaultTargetAltitude,
		relativeAltitude: defaultRelativeAltitude
	},
	(row) => {
		return row as unknown as FlightDirector;
	}
);
