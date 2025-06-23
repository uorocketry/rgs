<script lang="ts">
	import 'cesium/Build/Cesium/Widgets/widgets.css';
	// Set the base URL for Cesium assets - MUST match viteStaticCopy dest
	// @ts-expect-error Custom window property assignment
	window.CESIUM_BASE_URL = '/cesium/';

	import { onMount } from 'svelte';
	import * as Cesium from 'cesium';
	import type { Viewer } from 'cesium';
	import { Spring } from 'svelte/motion';

	// Props - Reinstate dynamic camera control props
	let {
		pitch: pitchProp = 0,
		roll: rollProp = 0,
		altitude: altitudeProp = 0,
		heading: headingProp = 0,
		latitude: latitudeProp = 0,
		longitude: longitudeProp = 0
	} = $props<{
		pitch?: number;
		roll?: number;
		altitude?: number;
		heading?: number;
		latitude?: number;
		longitude?: number;
	}>();

	// Spring stores for smooth interpolation
	const springOptions = { stiffness: 0.8, damping: 0.5 };
	let latitude = new Spring(latitudeProp, springOptions);
	let longitude = new Spring(longitudeProp, springOptions);
	let altitude = new Spring(altitudeProp, springOptions);
	let pitch = new Spring(pitchProp, springOptions);
	let roll = new Spring(rollProp, springOptions);
	let heading = new Spring(headingProp, springOptions);

	// Display dimensions
	const width = 600;
	const height = 600;

	// Cesium Variables
	let cesiumContainer: HTMLDivElement;
	let viewer: Viewer | null = null;

	// Track container dimensions
	let containerWidth = $state(0);
	let containerHeight = $state(0);

	onMount(() => {
		// Optional: Add Ion token here if needed later for Ion assets.
		// Cesium.Ion.defaultAccessToken = 'YOUR_TOKEN';

		viewer = new Cesium.Viewer(cesiumContainer, {
			// UI Widgets to disable
			animation: false,
			baseLayerPicker: false,
			fullscreenButton: false,
			vrButton: false,
			geocoder: false,
			homeButton: false,
			infoBox: false,
			sceneModePicker: false,
			selectionIndicator: false,
			timeline: false,
			navigationHelpButton: false,
			shouldAnimate: true, // Keep animation loop

			baseLayer: new Cesium.ImageryLayer(
				new Cesium.UrlTemplateImageryProvider({
					url: window.location.origin + '/tiles/{z}/{x}/{y}'
				})
			)

		});

		// Disable mouse interactions
		if (viewer.scene) {
			viewer.scene.screenSpaceCameraController.enableRotate = false;
			viewer.scene.screenSpaceCameraController.enableZoom = false;
			viewer.scene.screenSpaceCameraController.enableTranslate = false;
			viewer.scene.screenSpaceCameraController.enableTilt = false;
			viewer.scene.screenSpaceCameraController.enableLook = false;
		}

		// Optional: Improve visual quality if needed
		if (viewer.scene) {
			viewer.scene.globe.enableLighting = true;
			viewer.scene.postProcessStages.fxaa.enabled = true;
		}

		// Remove static Ottawa camera setup
		// const ottawaLongitude = ...
		// const ottawaLatitude = ...
		// const viewAltitude = ...
		// viewer.camera.flyTo({ ... });

		// Cleanup viewer on component destroy
		return () => {
			if (viewer && !viewer.isDestroyed()) {
				viewer.destroy();
				viewer = null;
			}
		};
	});

	// Effect to update spring target values when props change
	$effect(() => {
		latitude.target = latitudeProp;
		longitude.target = longitudeProp;
		altitude.target = altitudeProp;
		pitch.target = pitchProp;
		roll.target = rollProp;
		heading.target = headingProp;
	});

	// Reinstate effect that updates camera based on props
	// Now uses spring values and setView
	$effect(() => {
		if (!viewer || viewer.isDestroyed()) return;

		// Get current values from springs
		const currentLat = latitude.current;
		const currentLon = longitude.current;
		const currentAlt = altitude.current;
		const currentPitch = pitch.current;
		const currentRoll = roll.current;
		const currentHeading = heading.current;

		const position = Cesium.Cartesian3.fromDegrees(currentLon, currentLat, currentAlt);
		const orientation = {
			heading: Cesium.Math.toRadians(currentHeading),
			pitch: Cesium.Math.toRadians(currentPitch),
			roll: Cesium.Math.toRadians(currentRoll)
		};

		// Use setView with interpolated spring values
		viewer.camera.setView({
			destination: position,
			orientation: orientation
		});

		// No need to request render if shouldAnimate: true
	});

	// Effect to resize Cesium viewer when container dimensions change
	$effect(() => {
		// Depend on containerWidth, containerHeight, and viewer
		containerWidth;
		containerHeight;
		if (viewer && !viewer.isDestroyed()) {
			console.log(`Resizing Cesium to: ${containerWidth} x ${containerHeight}`);
			viewer.resize();
			// No need to request render if shouldAnimate: true
			// viewer.scene.requestRender();
		}
	});
</script>

<!-- Apply size directly to the Cesium container div -->
<div
	bind:this={cesiumContainer}
	bind:clientWidth={containerWidth}
	bind:clientHeight={containerHeight}
	class="cesium-viewer-div h-full w-full rounded overflow-hidden bg-red-500"
	style="width: {width}px; height: {height}px;"
>
	<!-- Cesium initializes here -->
</div>

<style>
	/* Hide the default Cesium credits display */
	.cesium-viewer-div :global(.cesium-widget-credits) {
		display: none !important;
	}
</style>
