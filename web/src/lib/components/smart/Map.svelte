<script defer lang="ts" type="module">
	import { browser } from '$app/environment';
	import { defaultLaunchCoords, flightDirector } from '$lib/realtime/flightDirector';
	import { rocketPos } from '$lib/realtime/gps';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import L from 'leaflet';
	import { onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { writable } from 'svelte/store';

	let map: L.Map | null;

	const urlTemplate = '/api/tiles/{z}/{x}/{y}.png';

	const initialX = browser ? localStorageStore('mapX', 45.4215) : writable(0);
	const initialY = browser ? localStorageStore('mapY', -75.6972) : writable(0);

	const initialView: L.LatLngTuple = [$initialX, $initialY];

	let rocketMarker = L.marker(defaultLaunchCoords, {
		icon: L.divIcon({
			// Maybe some custom checkpoints?
			html: '🚀',
			className: 'bg-transparent text-3xl '
		})
	});

	let launchPointMarker = L.marker(defaultLaunchCoords, {
		icon: L.divIcon({
			// Maybe some custom checkpoints?
			html: '🏠',
			className: 'bg-transparent text-3xl '
		})
	});

	const MAX_ZOOM = 16;
	const MIN_ZOOM = 5;
	const INITIAL_ZOOM = 10;

	const target = tweened(defaultLaunchCoords, {
		interpolate: (a, b) => {
			return (t) => {
				return {
					lat: a.lat + t * (b.lat - a.lat),
					lng: a.lng + t * (b.lng - a.lng)
				};
			};
		}
	});

	const home = tweened(defaultLaunchCoords, {
		interpolate: (a, b) => {
			return (t) => {
				return {
					lat: a.lat + t * (b.lat - a.lat),
					lng: a.lng + t * (b.lng - a.lng)
				};
			};
		}
	});

	$: {
		target.set({
			lat: $rocketPos.latitude ?? 0,
			lng: $rocketPos.longitude ?? 0
		});
		home.set({
			lat: $flightDirector.latitude ?? 0,
			lng: $flightDirector.longitude ?? 0
		});
	}

	$: {
		rocketMarker.setLatLng($target);
		launchPointMarker.setLatLng($home);
	}

	function createMap(container: string | HTMLElement) {
		let m = L.map(container, {
			preferCanvas: true,
			worldCopyJump: true,
			minZoom: MIN_ZOOM
			// Uncomment to restrict the map to the bounds
			// maxBounds: bounds
		}).setView(initialView, INITIAL_ZOOM);

		L.tileLayer(urlTemplate, {
			maxNativeZoom: MAX_ZOOM,
			minNativeZoom: MIN_ZOOM
		}).addTo(m); // The actual satellite imagery

		return m;
	}

	let toolbar = new L.Control({ position: 'topright' });
	toolbar.onAdd = () => {
		let div = L.DomUtil.create('div');
		return div;
	};

	let mapEl: HTMLElement;
	onMount(() => {
		map = createMap(mapEl);
		toolbar.addTo(map);
		launchPointMarker.addTo(map);
		rocketMarker.addTo(map);

		mapEl.onmouseup = () => {
			// Save the map position
			$initialX = map?.getCenter().lat ?? 0;
			$initialY = map?.getCenter().lng ?? 0;
		};
	});

	onDestroy(() => {
		toolbar.remove();
		map?.remove();
		map = null;
	});

	let clientHeight = 0;
	let clientWidth = 0;
	$: if (browser) {
		clientHeight;
		clientWidth;
		if (map) {
			map.invalidateSize();
		}
	}

	function onMouseUp() {
		console.log('drag');
	}
</script>

<div
	class="h-full w-full isolate"
	bind:this={mapEl}
	bind:clientHeight
	bind:clientWidth
	role="application"
/>
