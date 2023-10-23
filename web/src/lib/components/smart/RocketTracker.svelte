<script defer lang="ts" type="module">
	import { browser } from '$app/environment';
	import { flightDirector } from '$lib/realtime/flightDirector';
	import { rocketPos } from '$lib/realtime/gps';
	import L from 'leaflet';
	import { onDestroy, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	let map: L.Map | null;

	const urlTemplate = '/api/tiles/{z}/{x}/{y}.png';

	let rocketMarker: L.Marker<unknown>;

	$: rocketXY = { x: $rocketPos.latitude ?? 0, y: $rocketPos.longitude ?? 0 };
	$: rocketLatLng = { lat: rocketXY.x, lng: rocketXY.y };

	let launchPointMarker = L.marker(rocketLatLng, {
		icon: L.divIcon({
			// Maybe some custom checkpoints?
			html: '🏠',
			className: 'bg-transparent text-3xl '
		})
	});

	const MAX_ZOOM = 14;
	const MIN_ZOOM = 5;
	const INITIAL_ZOOM = 10;

	let sprintCoords = spring(rocketXY, {
		stiffness: 0.1,
		damping: 0.25
	});

	sprintCoords.subscribe((val) => {
		rocketMarker?.setLatLng({
			lat: val.x,
			lng: val.y
		});
	});

	rocketMarker = L.marker(rocketLatLng, {
		icon: L.divIcon({
			html: '🚀',
			className: 'bg-transparent text-3xl '
		})
	});

	// Subscribe to the store
	$: {
		launchPointMarker.setLatLng({
			lat: $flightDirector?.latitude ?? 0,
			lng: $flightDirector?.longitude ?? 0
		});
	}

	$: {
		console.log('setting view');
		sprintCoords.set(rocketXY);
		if (map) {
			map.setView(rocketLatLng, map.getZoom());
		}
	}

	function createMap(container: string | HTMLElement) {
		let m = L.map(container, {
			preferCanvas: true,
			worldCopyJump: true,
			minZoom: MIN_ZOOM
		}).setView(rocketLatLng, INITIAL_ZOOM);

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

<div class="w-full h-full">
	<div class="w-full h-full z-0" bind:this={mapEl} bind:clientHeight bind:clientWidth />
	<div class="variant-glass p-2 absolute top-0 right-0 z-10">
		<ul class="menu-xs bg-base-100 !p-0">
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${rocketLatLng.lat}`)}>
					Lat: {rocketLatLng.lat.toFixed(5)}
				</button>
			</li>
			<li>
				<button on:click={() => navigator.clipboard.writeText(`${rocketLatLng.lng}`)}>
					Lng: {rocketLatLng.lng.toFixed(5)}
				</button>
			</li>
		</ul>
	</div>
</div>
