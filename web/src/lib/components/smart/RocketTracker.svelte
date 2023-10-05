<script defer lang="ts" type="module">
	import { browser } from '$app/environment';
	import { launchPoint } from '$lib/realtime/flightDirector';
	import { rocketPosition } from '$lib/realtime/gps';
	import L from 'leaflet';
	import { onDestroy, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	let map: L.Map | null;

	const urlTemplate = '/api/tiles/{z}/{x}/{y}.png';

	let rocketMarker: L.Marker<unknown>;

	let launchPointMarker = L.marker($launchPoint, {
		icon: L.divIcon({
			// Maybe some custom checkpoints?
			html: '🏠',
			className: 'bg-transparent text-3xl '
		})
	});

	const MAX_ZOOM = 14;
	const MIN_ZOOM = 5;
	const INITIAL_ZOOM = 10;

	let sprintCoords = spring(
		{ x: $rocketPosition.lat, y: $rocketPosition.lng },
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
		rocketMarker = L.marker($rocketPosition, {
			icon: L.divIcon({
				html: '🚀',
				className: 'bg-transparent text-3xl '
			})
		});
	}

	// Subscribe to the store
	launchPoint.subscribe(({ lat, lng }) => {
		if (lat && lng) {
			launchPointMarker.setLatLng({ lat, lng });
		}
	});

	$: {
		const rocketCoords = $rocketPosition;
		sprintCoords.set({ x: rocketCoords.lat, y: rocketCoords.lng });
		if (map) {
			map.setView(rocketCoords, map.getZoom());
		}
	}

	function createMap(container: string | HTMLElement) {
		let m = L.map(container, {
			preferCanvas: true,
			worldCopyJump: true,
			minZoom: MIN_ZOOM
		}).setView($rocketPosition, INITIAL_ZOOM);

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

	let mapEl: HTMLDivElement;
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

<div class="isolate w-full h-full">
	<div class="w-full h-full" bind:this={mapEl} bind:clientHeight bind:clientWidth />
	<div class="overlay">
		<ul class="menu menu-xs bg-base-100 !p-0">
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${$rocketPosition.lat}`)}>
					Lat: {$rocketPosition.lat.toFixed(5)}
				</button>
			</li>
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${$rocketPosition.lng}`)}>
					Lng: {$rocketPosition.lng.toFixed(5)}
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
