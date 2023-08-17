// initialLaunchPosition.js
import { writable } from 'svelte/store';

export const latestLaunchPoint = writable({
    lat: 0, lng: 0
  });
