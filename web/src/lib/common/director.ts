// initialLaunchPosition.js
import { writable } from 'svelte/store';


const launchSiteCoordinates = [47.98714, -81.84864];
	const launchSiteCoordinatesLatLng = {
		lat: launchSiteCoordinates[0],
		lng: launchSiteCoordinates[1]
	};

// latestLaunchPoint
export const latestLaunchPoint = writable(launchSiteCoordinatesLatLng);
