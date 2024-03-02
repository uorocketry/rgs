<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	// import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import '../../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import { onMount, onDestroy } from 'svelte';

	let map: mapboxgl.Map;
	let mapContainer: HTMLDivElement;
	let lng: number, lat: number, zoom: number;

	lng = -71.224518;
	lat = 42.213995;
	zoom = 9;

	onMount(() => {
		const initialState = { lng: lng, lat: lat, zoom: zoom };
		// url: window.location.origin + '/api/tiles/{z}/{x}/{y}'
		mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
		map = new mapboxgl.Map({
			container: 'map', // container ID
			style: {
				version: 8,
				sources: {
					'raster-tiles': {
						type: 'raster',
						tiles: [window.location.origin + '/api/tiles/{z}/{x}/{y}'],
						tileSize: 256
					},
					'elevation-tiles': {
						type: 'geojson',
						// tiles: [window.location.origin + '/api/tiles/{z}/{x}/{y}'],
						// https://s3.amazonaws.com/elevation-tiles-prod/terrarium/3/2/1.png
						tiles: [window.location.origin + '/api/elevation/{z}/{x}/{y}'],
						tileSize: 256,
						encoding: 'terrarium'
					}
				},
				layers: [
					{
						id: 'simple-tiles',
						type: 'raster',
						source: 'raster-tiles',
						minzoom: 0,
						maxzoom: 22
					}
				]
			},
			center: [-74.5, 40], // starting position
			zoom: 2 // starting zoom
		});
		map.on('style.load', () => {
			console.log('Map style loaded');
			// map.addSource('elevation-tiles', {
			// 	type: 'raster-dem',
			// 	url: 'mapbox://mapbox.terrain-rgb'
			// });
			map.setTerrain({ source: 'elevation-tiles' });
		});

		let disabledOnPitch = false;
		map.on('pitch', () => {
			if (map.getPitch() < 30) {
				map.setTerrain(
					map.getPitch() < 1
						? null
						: {
								source: 'mapbox-dem',
								exaggeration: (map.getPitch() / 30) * 2
							}
				);
				disabledOnPitch = true;
			} else if (disabledOnPitch) {
				map.setTerrain({ source: 'mapbox-dem', exaggeration: 2 });
			}
		});
	});

	onDestroy(() => {
		map.remove();
	});
</script>

<div class="map-wrap h-full">
	<div id="map" class="map" bind:this={mapContainer} />
</div>

<style>
	.map {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>
