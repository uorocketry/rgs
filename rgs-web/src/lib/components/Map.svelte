<script defer lang="ts" type="module">
	import L from 'leaflet';
	import { LatLngBounds } from 'leaflet';
	import { onInterval } from '$lib/common/utils';
	import { browser } from '$app/environment';
	import { sensor } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';

	// FIXME: The mock rocket position reports the rocket as being in the middle of the Gulf of Guinea (northwest of South Africa)

	let map: L.Map | null;

	const urlTemplate = '/api/tiles/{z}/{x}/{y}.png';

	const blBound: L.LatLngTuple = [45.36126613049103, -75.7866211272455];
	const tlBound: L.LatLngTuple = [45.46758335970629, -75.6263392346481];

	const initialView: L.LatLngTuple = [(blBound[0] + tlBound[0]) / 2, (blBound[1] + tlBound[1]) / 2];

	const mockRocketStartPos: L.LatLngLiteral = {
		lat: 45.415210720923476,
		lng: -75.7511577908654
	};

	let rocketMarker: L.Marker<any>;

	const MAX_ZOOM = 14;
	const MIN_ZOOM = 5;
	const INITIAL_ZOOM = 10;

	let target: L.LatLngLiteral = mockRocketStartPos;

	if (browser) {
		rocketMarker = L.marker(mockRocketStartPos, {
			icon: L.divIcon({
				// Maybe some custom checkpoints?
				html: '🚀',
				className: 'bg-transparent text-3xl '
			})
		});

		const unsub = sensor.subscribe((sens) => {
			target = {
				lat: sens.data.Sbg.latitude,
				lng: sens.data.Sbg.longitude
			};
		});
		onDestroy(unsub);
		onInterval(() => {
			let curPos: L.LatLng = rocketMarker.getLatLng();
			const lerpFactor = 0.01;
			let interpolatedPos: L.LatLngTuple = [
				curPos.lat + lerpFactor * (target.lat - curPos.lat),
				curPos.lng + lerpFactor * (target.lng - curPos.lng)
			];
			rocketMarker.setLatLng(interpolatedPos);
		}, 10);
	}

	const bounds: L.LatLngBounds = new LatLngBounds(blBound, tlBound);

	function createMap(container: string | HTMLElement) {
		let m = L.map(container, {
			preferCanvas: true,
			worldCopyJump: true,
			minZoom: MIN_ZOOM
			// Uncomment to restrict the map to the bounds
			// maxBounds: bounds,
		}).setView(initialView, INITIAL_ZOOM);

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

	let mapEl: HTMLElement;
	onMount(() => {
		map = createMap(mapEl);
		let mapEl: HTMLElement;
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

<div class="z-auto h-full w-full isolate" bind:this={mapEl} bind:clientHeight bind:clientWidth />
