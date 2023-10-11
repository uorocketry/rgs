<script defer lang="ts" type="module">
	import L, { type LatLngBoundsExpression } from 'leaflet';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { defaultLaunchCoords, launchPoint } from '$lib/realtime/flightDirector';
	import { rocketPosition } from '$lib/realtime/gps';
	import { tweened } from 'svelte/motion';

	let map: L.Map | null;

	const urlTemplate = '/api/tiles/{z}/{x}/{y}.png';

	const brBound: L.LatLngTuple = [47.72952771887304, -81.38978578997438];
	const tlBound: L.LatLngTuple = [48.23170547259465, -82.47626677156998];
	const bounds: LatLngBoundsExpression = [brBound, tlBound];

	const initialView: L.LatLngTuple = [(brBound[0] + tlBound[0]) / 2, (brBound[1] + tlBound[1]) / 2];

	let rocketMarker: L.Marker<unknown>;
	let launchPointMarker = L.marker($launchPoint, {
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

	$: {
		target.set($rocketPosition);
	}

	$: if (rocketMarker){
		rocketMarker.setLatLng($target);
	}

	if (browser) {
		// Fix: Setting launch point only works at the beggingin after that the marker isn't updated
		launchPoint.subscribe(({ lat, lng }) => {
			if (lat !== undefined && lng !== undefined) {
				launchPointMarker.setLatLng({ lat, lng });
			}
		});
		rocketMarker = L.marker(defaultLaunchCoords, {
			icon: L.divIcon({
				// Maybe some custom checkpoints?
				html: '🚀',
				className: 'bg-transparent text-3xl '
			}),
		})


	}

	function createMap(container: string | HTMLElement) {
		let m = L.map(container, {
			preferCanvas: true,
			worldCopyJump: true,
			minZoom: MIN_ZOOM,
			// Uncomment to restrict the map to the bounds
			maxBounds: bounds,
		}).setView(initialView, INITIAL_ZOOM);

		L.tileLayer(urlTemplate, {
			maxNativeZoom: MAX_ZOOM,
			minNativeZoom: MIN_ZOOM,
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
		rocketMarker.addTo(map);
		launchPointMarker.addTo(map);
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
</script>

<div class="h-full w-full isolate" bind:this={mapEl} bind:clientHeight bind:clientWidth />
