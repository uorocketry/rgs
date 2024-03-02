<script lang="ts">
	import { onMount } from 'svelte';
	import { Viewer } from 'cesium';
	import '../../../../../node_modules/cesium/Build/Cesium/Widgets/widgets.css';
	import * as Cesium from 'cesium';

	// @ts-expect-error Custom window property
	window.CESIUM_BASE_URL = 'node_modules/cesium/Build/Cesium';

	console.log('Cesium', Cesium);
	let viewer: Viewer;
	onMount(async () => {
		viewer = new Viewer('cesiumContainer', {
			navigationHelpButton: false,
			baseLayerPicker: false,
			fullscreenButton: false,
			vrButton: false,
			homeButton: false,
			geocoder: false,
			sceneModePicker: false,

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

		viewer.flyTo(ottawa);

		// Create an arc between Ottawa and Toronto
		var ottawaPosition = Cesium.Cartesian3.fromDegrees(-75.69, 45.42, 1000);
		var torontoPosition = Cesium.Cartesian3.fromDegrees(-79.38, 43.65, 1000);

		// Define the height of the arc
		var height = 50_000;

		// Generate the arc points
		var arcPoints = [];
		for (var i = 0; i <= 100; i++) {
			var t = i / 100.0;
			var position = Cesium.Cartesian3.lerp(
				ottawaPosition,
				torontoPosition,
				t,
				new Cesium.Cartesian3()
			);
			position = Cesium.Cartesian3.fromElements(
				position.x,
				position.y,
				position.z + height * Math.sin(Math.PI * t)
			);
			arcPoints.push(position);
		}

		var polyline = new Cesium.PolylineGeometry({
			positions: arcPoints,
			width: 10.0
		});

		viewer.scene.primitives.add(
			new Cesium.Primitive({
				geometryInstances: new Cesium.GeometryInstance({
					geometry: polyline,
					attributes: {
						color: Cesium.ColorGeometryInstanceAttribute.fromColor(
							new Cesium.Color(1.0, 0.5, 1.0, 0.75)
						)
					}
				}),
				appearance: new Cesium.PolylineColorAppearance({
					translucent: true
				})
			})
		);

		// Add a marker on toronto'
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

		const sampledPos = new Cesium.SampledPositionProperty();
		var circlingPoint = viewer.entities.add({
			position: sampledPos,
			point: {
				pixelSize: 10,
				color: Cesium.Color.GREEN
			}
		});

		setInterval(() => {
			let time = Cesium.JulianDate.now();
			let in1Seconds = Cesium.JulianDate.addSeconds(time, 0.2, time);

			sampledPos.addSample(
				in1Seconds,
				new Cesium.Cartesian3(
					ottawaPosition.x + Math.sin(time.secondsOfDay) * 100,
					ottawaPosition.y,
					ottawaPosition.z
				)
			);
		}, 100);

		viewer.trackedEntity = circlingPoint;

		// viewer.zoomTo(arc);

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
