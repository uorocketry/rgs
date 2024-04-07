<script lang="ts">
	import { onMount } from 'svelte';
	import { Viewer } from 'cesium';
	import '../../../../../node_modules/cesium/Build/Cesium/Widgets/widgets.css';
	import * as Cesium from 'cesium';

	//extra
	import { LatestCoordinates } from './types';

	// TODOS:
	// - Add launch coordinates
	// - Get rocket position from GQL
	// - Add rocket model
	// - Add rocket trajectory

	// @ts-expect-error Custom window property
	window.CESIUM_BASE_URL = 'node_modules/cesium/Build/Cesium';

	console.log('Cesium', Cesium);
	let viewer: Viewer;

	let test: any;

	let latestCoordinates = {
		latitude: 0,
		longitude: 0,
		altitude: 0
	};

	$: latestCoordinatesData = $LatestCoordinates.data;

	$: {
		latestCoordinates = {
			latitude: latestCoordinatesData?.rocket_sensor_gps_pos_1[0]?.latitude ?? 0,
			longitude: latestCoordinatesData?.rocket_sensor_gps_pos_1[0]?.longitude ?? 0,
			altitude: latestCoordinatesData?.rocket_sensor_gps_pos_1[0]?.altitude ?? 0
		};

		if (viewer && test) {
			console.log('Updating label text and position');

			// Update label text
			test.label.text = new Cesium.ConstantProperty(
				`Latitude: ${latestCoordinates.latitude}, Longitude: ${latestCoordinates.longitude}, Altitude: ${latestCoordinates.altitude} meters`
			);

			// Calculate position
			const zPosition = latestCoordinates.altitude; // adjust scale factor etc
			test.position = new Cesium.ConstantPositionProperty(
				Cesium.Cartesian3.fromDegrees(
					latestCoordinates.longitude,
					latestCoordinates.latitude,
					zPosition
				)
			);
		}
	}

	onMount(async () => {
		viewer = new Viewer('cesiumContainer', {
			navigationHelpButton: false,
			baseLayerPicker: false,
			fullscreenButton: false,
			vrButton: false,
			homeButton: false,
			geocoder: false,
			sceneModePicker: false,
			shouldAnimate: true,

			baseLayer: new Cesium.ImageryLayer(
				new Cesium.UrlTemplateImageryProvider({
					url: window.location.origin + '/api/tiles/{z}/{x}/{y}'
				})
			)
		});

		// Create an arc between Ottawa and Toronto
		const JMTSPosition = Cesium.Cartesian3.fromDegrees(-75.68033372705948, 45.42010692442428, 100);

		//add marker for JMTS
		var JMTS = viewer.entities.add({
			position: JMTSPosition,
			point: {
				pixelSize: 10,
				color: Cesium.Color.BLUE
			},
			label: {
				text: 'JMTS',
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			}
		});

		//add rocket model
		test = viewer.entities.add({
			position: JMTSPosition,
			model: {
				uri: '/models/rocket.glb',
				runAnimations: false,
				scale: 1.0, // Optional: Adjust the scale of the model if needed
				minimumPixelSize: 50 // Optional: Minimum pixel size for the model*/
			},
			label: {
				text: 'Coordinates: unknown', // Initial coordinates label
				font: '14px sans-serif',
				fillColor: Cesium.Color.YELLOW,
				outlineColor: Cesium.Color.BLACK,
				outlineWidth: 2,
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				pixelOffset: new Cesium.Cartesian2(0, -100), // Offset label position
				backgroundColor: Cesium.Color.WHITE
			}
		});

		viewer.flyTo(test);
		//viewer.flyTo(JMTS);

		viewer.trackedEntity = test;

		// Delete "cesium-widget-credits" after the viewer is created
		setTimeout(() => {
			const credits = document.getElementsByClassName('cesium-widget-credits');
			if (credits.length > 0) {
				credits[0]?.remove();
			}
		}, 1000);
	});
</script>

<div id="cesiumContainer" class="h-full"></div>
