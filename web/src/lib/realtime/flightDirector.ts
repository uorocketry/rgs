import { Collections } from '../common/pocketbase-types';
import { latestCollectionWritable } from './lastestCollectionWritable';

export const defaultLaunchCoordinates = [47.98714, -81.84864];
export const defaultLaunchCoords = {
	lat: defaultLaunchCoordinates[0],
	lng: defaultLaunchCoordinates[1]
};


export const defaultTargetAltitude = 7000;
export const defaultRelativeAltitude = 360;

export const flightDirector = latestCollectionWritable(Collections.FlightDirector)
