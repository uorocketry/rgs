// initialLaunchPosition.js
import { pb } from '$lib/stores';
import { writable } from 'svelte/store';


export const defaultLaunchCoordinates = [47.98714, -81.84864];
	export const defaultLaunchCoords = {
		lat: defaultLaunchCoordinates[0],
		lng: defaultLaunchCoordinates[1]
	};

// latestLaunchPoint
export const latestLaunchPoint = writable(defaultLaunchCoords,  (set) => {
  const unsub =  pb.collection("FlightDirector").subscribe("*", (msg) => {
    if (msg.action === "create") {
      const latitude = msg.record.latitude;
      const longitude = msg.record.longitude;
      set({
        lat: latitude,
        lng: longitude
      });
    }
  });

  return async () => {
    (await unsub)();
  }

});
