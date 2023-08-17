<!-- <script defer lang="ts" type="module">
	import L from 'leaflet';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { onCollectionCreated } from '$lib/common/utils';
	import type { EkfNav2 } from '@rgs/bindings';
	import { writable } from 'svelte/store';
	import { initialLaunchPosition } from '../../common/director';

	export const launchPoint = writable({ lat: 0, lng: 0 });

	// FIXME: The mock rocket position reports the rocket as being in the middle of the Gulf of Guinea (northwest of South Africa)

	let map: L.Map | null;

	const urlTemplate = '/api/tiles/{z}/{x}/{y}.png';

	const mockRocketStartPos: L.LatLngLiteral = {
		lat: 45.415210720923476,
		lng: -75.7511577908654
	};

	let rocketMarker: L.Marker<unknown>;

	const MAX_ZOOM = 14;
	const MIN_ZOOM = 5;
	const INITIAL_ZOOM = 10;

	let rocketCoords: L.LatLngLiteral = mockRocketStartPos;

	let sprintCoords = spring(
		{ x: mockRocketStartPos.lat, y: mockRocketStartPos.lng },
		{
			stiffness: 0.1,
			damping: 0.25
		}
	);
	sprintCoords.subscribe((val) => {
		rocketMarker?.setLatLng({
			lat: val.x,
			lng: val.y
		});
	});

	if (browser) {
		rocketMarker = L.marker(mockRocketStartPos, {
			icon: L.divIcon({
				// Maybe some custom checkpoints?
				html: '🚀',
				className: 'bg-transparent text-3xl '
			})
		});

		onCollectionCreated('EkfNav2', (msg: EkfNav2) => {
			rocketCoords = {
				lat: msg.position[0],
				lng: msg.position[1]
			};
			sprintCoords.set({ x: rocketCoords.lat, y: rocketCoords.lng });

			if (map) {
				map.setView(rocketCoords, map.getZoom());
			}
		});
	}

	function createMap(container: string | HTMLElement) {
		let m = L.map(container, {
			preferCanvas: true,
			worldCopyJump: true,
			minZoom: MIN_ZOOM
		}).setView(mockRocketStartPos, INITIAL_ZOOM);

		L.tileLayer(urlTemplate, {
			maxNativeZoom: MAX_ZOOM,
			minNativeZoom: MIN_ZOOM
		}).addTo(m); // The actual satellite imagery

		return m;
	}

	let toolbar = new L.Control({ position: 'topright' });
	toolbar.onAdd = (_: L.Map) => {
		let div = L.DomUtil.create('div');
		return div;
	};

	let mapEl: HTMLDivElement;
	onMount(() => {
		map = createMap(mapEl);
		toolbar.addTo(map);
		rocketMarker.addTo(map);
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

<div class="isolate w-full h-full">
	<div class="w-full h-full" bind:this={mapEl} bind:clientHeight bind:clientWidth />
	<div class="overlay">
		<ul class="menu menu-xs bg-base-100 !p-0">
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${rocketCoords.lat}`)}>
					Lat: {rocketCoords.lat.toFixed(5)}
				</button>
			</li>
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${rocketCoords.lng}`)}>
					Lng: {rocketCoords.lng.toFixed(5)}
				</button>
			</li>
		</ul>
	</div>
</div>

<style>
	.overlay {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1000;
	}
</style> -->

<script defer lang="ts" type="module">
	import L from 'leaflet';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { onCollectionCreated } from '$lib/common/utils';
	import type { EkfNav2 } from '@rgs/bindings';
	import { latestLaunchPoint } from '../../common/director'; // Import the store

	let map: L.Map | null;

	const urlTemplate = '/api/tiles/{z}/{x}/{y}.png';

	const mockRocketStartPos: L.LatLngLiteral = {
		lat: 45.415210720923476,
		lng: -75.7511577908654
	};

	let rocketMarker: L.Marker<unknown>;
	let rocketCoords: L.LatLngLiteral = {
		lat: 45.415210720923476,
		lng: -75.7511577908654
	};

	const MAX_ZOOM = 14;
	const MIN_ZOOM = 5;
	const INITIAL_ZOOM = 10;

	let sprintCoords = spring(
		{ x: rocketCoords.lat, y: rocketCoords.lng },
		{
			stiffness: 0.1,
			damping: 0.25
		}
	);

	sprintCoords.subscribe((val) => {
		rocketMarker?.setLatLng({
			lat: val.x,
			lng: val.y
		});
	});

	if (browser) {
		// Using rocketCoords which could have been updated from the store
		rocketMarker = L.marker(rocketCoords, {
			icon: L.divIcon({
				html: '🚀',
				className: 'bg-transparent text-3xl '
			})
		});
	}

	// Subscribe to the store
	latestLaunchPoint.subscribe(({ lat, lng }) => {
		if (lat && lng) {
			rocketCoords = { lat, lng };
			sprintCoords.set({ x: lat, y: lng }); // Also update the sprintCoords for smooth transition

			if (map) {
				map.setView(rocketCoords, map.getZoom());
			}
		}
	});

	onCollectionCreated('EkfNav2', (msg: EkfNav2) => {
		rocketCoords = {
			lat: msg.position[0],
			lng: msg.position[1]
		};
		sprintCoords.set({ x: rocketCoords.lat, y: rocketCoords.lng });

		if (map) {
			map.setView(rocketCoords, map.getZoom());
		}
	});

	function createMap(container: string | HTMLElement) {
		let m = L.map(container, {
			preferCanvas: true,
			worldCopyJump: true,
			minZoom: MIN_ZOOM
		}).setView(mockRocketStartPos, INITIAL_ZOOM);

		L.tileLayer(urlTemplate, {
			maxNativeZoom: MAX_ZOOM,
			minNativeZoom: MIN_ZOOM
		}).addTo(m); // The actual satellite imagery

		return m;
	}

	let toolbar = new L.Control({ position: 'topright' });
	toolbar.onAdd = (_: L.Map) => {
		let div = L.DomUtil.create('div');
		return div;
	};

	let mapEl: HTMLDivElement;
	onMount(() => {
		map = createMap(mapEl);
		toolbar.addTo(map);
		rocketMarker.addTo(map);
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

<div class="isolate w-full h-full">
	<div class="w-full h-full" bind:this={mapEl} bind:clientHeight bind:clientWidth />
	<div class="overlay">
		<ul class="menu menu-xs bg-base-100 !p-0">
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${rocketCoords.lat}`)}>
					Lat: {rocketCoords.lat.toFixed(5)}
				</button>
			</li>
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${rocketCoords.lng}`)}>
					Lng: {rocketCoords.lng.toFixed(5)}
				</button>
			</li>
		</ul>
	</div>
</div>

<style>
	.overlay {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1000;
	}
</style>
