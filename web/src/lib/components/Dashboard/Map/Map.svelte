<script lang="ts">
	import { onMount } from 'svelte';
	import { Viewer } from 'cesium';	
	import '../../../../../node_modules/cesium/Build/Cesium/Widgets/widgets.css';
	import * as Cesium from 'cesium';
	

	//extra
	import {LatestCoordinates} from "./types"

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
			latitude: latestCoordinatesData?.rocket_sensor_gps_pos_1[0].latitude ?? 0,
			longitude: latestCoordinatesData?.rocket_sensor_gps_pos_1[0].longitude ?? 0,
			altitude: latestCoordinatesData?.rocket_sensor_gps_pos_1[0].altitude ?? 0
		};

		if (viewer && test) {
			console.log("Updating label text and position");

			// Update label text
			test.label.text = new Cesium.ConstantProperty(`Latitude: ${latestCoordinates.latitude}, Longitude: ${latestCoordinates.longitude}, Altitude: ${latestCoordinates.altitude} meters`);

			// Calculate position
			const zPosition = latestCoordinates.altitude * 1000; // adjust scale factor etc
			test.position = new Cesium.ConstantPositionProperty(
				Cesium.Cartesian3.fromDegrees(latestCoordinates.longitude, latestCoordinates.latitude, zPosition)
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
			
			//extra: enables animation in the viewer
			shouldAnimate: true,

			baseLayer: new Cesium.ImageryLayer(
				new Cesium.UrlTemplateImageryProvider({
					url: window.location.origin + '/api/tiles/{z}/{x}/{y}'
				})
			)
			// Terrain only works with an internet connection so that's a no go
			// until we have a way to cache the tiles
			// terrain: Cesium.Terrain.fromWorldTerrain()
		});

		// add entity to ottawa (45.42, -75.69)
		var ottawa = viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees(-75.69, 45.42, 1000),
			point: {
				pixelSize: 10,
				color: Cesium.Color.RED
			},
			label: {
				text: 'Ottawa',
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			}
		});

		// Create an arc between Ottawa and Toronto
		var ottawaPosition = Cesium.Cartesian3.fromDegrees(-75.69, 45.42, 1000);
		var torontoPosition = Cesium.Cartesian3.fromDegrees(-79.38, 43.65, 1000);

		// Define the height of the arc
		var height = 50_000;

		// Generate the arc points
		// var arcPoints = [];
		// for (var i = 0; i <= 100; i++) {
		// 	var t = i / 100.0;
		// 	var position = Cesium.Cartesian3.lerp(
		// 		ottawaPosition,
		// 		torontoPosition,
		// 		t,
		// 		new Cesium.Cartesian3()
		// 	);
		// 	position = Cesium.Cartesian3.fromElements(
		// 		position.x,
		// 		position.y,
		// 		position.z + height * Math.sin(Math.PI * t)
		// 	);
		// 	arcPoints.push(position);
		// }

		// var polyline = new Cesium.PolylineGeometry({
		// 	positions: arcPoints,
		// 	width: 10.0
		// });

		// viewer.scene.primitives.add(
		// 	new Cesium.Primitive({
		// 		geometryInstances: new Cesium.GeometryInstance({
		// 			geometry: polyline,
		// 			attributes: {
		// 				color: Cesium.ColorGeometryInstanceAttribute.fromColor(
		// 					new Cesium.Color(1.0, 0.5, 1.0, 0.75)
		// 				)
		// 			}
		// 		}),
		// 		appearance: new Cesium.PolylineColorAppearance({
		// 			translucent: true
		// 		})
		// 	})
		// );

		// Add a marker on toronto
		var toronto = viewer.entities.add({
			position: torontoPosition,
			point: {
				pixelSize: 10,
				color: Cesium.Color.BLUE
			},
			label: {
				text: 'Toronto',
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			}
		});

		// const sampledPos = new Cesium.SampledPositionProperty();
		// var circlingPoint = viewer.entities.add({
		// 	position: sampledPos,
		// 	point: {
		// 		pixelSize: 10,
		// 		color: Cesium.Color.GREEN
		// 	}
		// });

		//add marker for JMTS
		var JMTS = viewer.entities.add({
			position : Cesium.Cartesian3.fromDegrees(-75.68033372705948, 45.42010692442428, 100),
			point: {
				pixelSize: 10,
				color: Cesium.Color.BLUE
			},
			label: {
				text: 'JMTS',
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			}
		});

		// //updates the position of the circling point
		// setInterval(() => {
		// 	let time = Cesium.JulianDate.now();
		// 	let in1Seconds = Cesium.JulianDate.addSeconds(time, 0.2, time);

		// 	sampledPos.addSample(
		// 		in1Seconds,
		// 		new Cesium.Cartesian3(
		// 			ottawaPosition.x + Math.sin(time.secondsOfDay) * 100,
		// 			ottawaPosition.y,
		// 			ottawaPosition.z
		// 		)
		// 	);
		// }, 100);


		//const sampledPos = new Cesium.SampledPositionProperty();
		test = viewer.entities.add({
			position: ottawaPosition,
			model: {
				uri: "/models/rocket.glb",
				runAnimations: false,
				scale: 1.0, // Optional: Adjust the scale of the model if needed
       			minimumPixelSize: 50 // Optional: Minimum pixel size for the model*/
			},
			label: {
				text: 'Altitude: 1000 meters', // Initial altitude label
				font: '14px sans-serif',
				fillColor: Cesium.Color.YELLOW,
				outlineColor: Cesium.Color.BLACK,
				outlineWidth: 2,
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				pixelOffset: new Cesium.Cartesian2(0, -100), // Offset label position
				//heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // Altitude relative to ground
				backgroundColor: Cesium.Color.WHITE
			},
				/*point: {
				pixelSize: 10,
				color: Cesium.Color.BLACK
			},*/

		});


		// LatestCoordinatesSubscription = LatestCoordinates.subscribe((data: any) => {
		// 	const latitude = data.data.rocket_sensor_gps_pos_1[0]?.latitude;
		// 	const longitude = data.data.rocket_sensor_gps_pos_1[0]?.longitude;
		// 	const altitude = data.data.rocket_sensor_gps_pos_1[0]?.altitude;

		// 	console.log('Altitude:', altitude);
		// 	console.log('Latitude:', latitude);
		// 	console.log('Longitude:', longitude);

		// 	if (latitude && longitude && altitude) {
		// 		const zPosition = altitude * 10000; //adjust scale factor etc
		// 		const newPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, zPosition);
		// 		//const currentTime = Cesium.JulianDate.now();
		// 		let time = Cesium.JulianDate.now();
		// 		let in1Seconds = Cesium.JulianDate.addSeconds(time, 5, time);
		// 		sampledPos.addSample(in1Seconds, newPosition); // Add new sample to SampledPositionProperty

		// 		// Update rocket's label
		// 		if (test.label) {
		// 			console.log("Updating label text");
		// 			test.label.text = new Cesium.ConstantProperty(`Latitude: ${latitude}, Longitude: ${longitude}, Altitude: ${altitude} meters`);
		// 		}
		// 	}
		// });

		// viewer.flyTo(test);
		//viewer.flyTo(JMTS);
	

		viewer.trackedEntity = test;	

		// Delete "cesium-widget-credits" after the viewer is created
		setTimeout(() => {
			const credits = document.getElementsByClassName('cesium-widget-credits');
			if (credits.length > 0) {
				credits[0].remove();
			}
		}, 1000);

	});


</script>

<div id="cesiumContainer" class="h-full"></div>