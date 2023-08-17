// initialLaunchPosition.js
import { writable } from 'svelte/store';

export const initialLaunchPosition = writable({ lat: 0, lng: 0 });
export const latestLaunchPoint = writable({
    lat: 0, lng: 0
  });
