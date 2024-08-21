<script lang="ts">
	import { onMount } from 'svelte';
	import { Viewer } from 'cesium';
	import 'cesium/Build/Cesium/Widgets/widgets.css';
	import * as Cesium from 'cesium';
	import { LatestAltitude, LatestCoordinates, LatestCoordinatesSBG } from './types';

	// TODOS:
	// - Add launch coordinates
	// - Add rocket trajectory

	// @ts-expect-error Custom window property
	window.CESIUM_BASE_URL = 'node_modules/cesium/Build/Cesium';

	let viewer: Viewer | undefined;

	let rocketModel: Cesium.Entity | undefined;
	let rocketModelSBG: Cesium.Entity | undefined;

	$: latestCoordinatesData = $LatestCoordinates.data;
	$: LatestCoordinatesSBGData = $LatestCoordinatesSBG.data;
	$: LatestAltitudeData = $LatestAltitude.data;
	console.log('Latest coordinates', latestCoordinatesData);
	console.log('Latest altitude', LatestAltitudeData);

	$: latestCoordinates = {
		latitude: latestCoordinatesData?.rocket_sensor_nav_pos_llh[0]?.latitude ?? 0,
		longitude: latestCoordinatesData?.rocket_sensor_nav_pos_llh[0]?.longitude ?? 0,
		altitude: LatestAltitudeData?.rocket_sensor_air[0]?.altitude ?? 0
	};

	$: latestCoordinatesSBG = {
		latitude: LatestCoordinatesSBGData?.rocket_sensor_gps_pos_1[0]?.latitude ?? 0,
		longitude: LatestCoordinatesSBGData?.rocket_sensor_gps_pos_1[0]?.longitude ?? 0
	};

	$: if (viewer && rocketModel) {
		console.log('Updating label text and position');

		// Update label text
		if (rocketModel.label) {
			rocketModel.label.text = new Cesium.ConstantProperty(
				`Backup GPS Latitude: ${latestCoordinates.latitude}, Longitude: ${latestCoordinates.longitude}, Altitude: ${latestCoordinates.altitude - 175} meters`
			);
		}

		// Calculate position
		const zPosition = latestCoordinates.altitude; // adjust scale factor etc
		rocketModel.position = new Cesium.ConstantPositionProperty(
			Cesium.Cartesian3.fromDegrees(
				latestCoordinates.longitude as number, //TODO get type
				latestCoordinates.latitude as number, //TODO get type
				zPosition
			)
		);
	}

	$: if (viewer && rocketModelSBG) {
		console.log('Updating label text and position');

		// Update label text
		if (rocketModelSBG.label) {
			rocketModelSBG.label.text = new Cesium.ConstantProperty(
				`SBG GPS Latitude: ${latestCoordinatesSBG.latitude}, Longitude: ${latestCoordinatesSBG.longitude}, Altitude: ${latestCoordinatesSBG.altitude - 175} meters`
			);
		}

		// Calculate position
		const zPosition = latestCoordinates.altitude + 10; // adjust scale factor etc
		rocketModelSBG.position = new Cesium.ConstantPositionProperty(
			Cesium.Cartesian3.fromDegrees(
				latestCoordinatesSBG.longitude as number, //TODO get type
				latestCoordinatesSBG.latitude as number, //TODO get type
				zPosition
			)
		);
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
		const launchpadPositon = Cesium.Cartesian3.fromDegrees(-81.8482847, 47.9869893, 100);

		//add marker for JMTS
		viewer.entities.add({
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

		viewer.entities.add({
			position: launchpadPositon,
			point: {
				pixelSize: 10,
				color: Cesium.Color.GREEN
			},
			label: {
				text: 'Launchpad',
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			}
		});

		//add rocket model
		rocketModel = viewer.entities.add({
			position: launchpadPositon,
			model: {
				uri: '/models/rocket.glb',
				runAnimations: false,
				scale: 1.0, // Optional: Adjust the scale of the model if needed
				minimumPixelSize: 50 // Optional: Minimum pixel size for the model*/
			}
			// label: {
			// 	text: 'Coordinates: unknown', // Initial coordinates label
			// 	font: '14px sans-serif',
			// 	fillColor: Cesium.Color.YELLOW,
			// 	outlineColor: Cesium.Color.BLACK,
			// 	outlineWidth: 2,
			// 	style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			// 	pixelOffset: new Cesium.Cartesian2(0, -100), // Offset label position
			// 	backgroundColor: Cesium.Color.WHITE
			// }
		});

		rocketModelSBG = viewer.entities.add({
			position: launchpadPositon,
			model: {
				uri: '/models/rocket.glb',
				runAnimations: false,
				scale: 1.0, // Optional: Adjust the scale of the model if needed
				minimumPixelSize: 50 // Optional: Minimum pixel size for the model*/
			}
			// label: {
			// 	text: 'Coordinates: unknown', // Initial coordinates label
			// 	font: '14px sans-serif',
			// 	fillColor: Cesium.Color.YELLOW,
			// 	outlineColor: Cesium.Color.BLACK,
			// 	outlineWidth: 2,
			// 	style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			// 	pixelOffset: new Cesium.Cartesian2(0, -100), // Offset label position
			// 	backgroundColor: Cesium.Color.WHITE
			// }
		});
		viewer.flyTo(rocketModel);
		//viewer.flyTo(JMTS);

		viewer.trackedEntity = rocketModel;

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
