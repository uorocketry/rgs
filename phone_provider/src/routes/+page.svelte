<script lang="ts">
	import Compass from '$lib/Compass.svelte';
	import { onMount } from 'svelte';

	let accelerometer_ok = false;
	let gyroscope_ok = false;
	let geolocation_ok = false;

	let last_quat = { x: 0, y: 0, z: 0, w: 0 };

	let last_acc = { x: 0, y: 0, z: 0 };

	let last_geo = { lat: 0, lon: 0, alt: 0 };

	let sensor_callback = (event: DeviceMotionEvent) => {
		if (event.acceleration) {
			last_acc = {
				x: event.acceleration.x ?? 0,
				y: event.acceleration.y ?? 0,
				z: event.acceleration.z ?? 0
			};
		}
	};

	function askForSensor() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				last_geo = {
					lat: position.coords.latitude,
					lon: position.coords.longitude,
					alt: position.coords.altitude ?? 0
				};
			},
			(error) => {}
		);

		const sensor = new AbsoluteOrientationSensor();

		Promise.all([
			//@ts-ignore
			navigator.permissions.query({ name: 'accelerometer' }),
			//@ts-ignore
			navigator.permissions.query({ name: 'magnetometer' }),
			//@ts-ignore
			navigator.permissions.query({ name: 'gyroscope' })
		]).then((results) => {
			if (results.every((result) => result.state === 'granted')) {
				sensor.start();

				sensor.onreading = () => {
					console.log('Sensor reading');
					console.log(sensor.quaternion);
					if (sensor.quaternion) {
						console.log('Sensor reading');

						let x = sensor.quaternion[0] ?? 0;
						let y = sensor.quaternion[1] ?? 0;
						let z = sensor.quaternion[2] ?? 0;
						let w = sensor.quaternion[3] ?? 0;

						last_quat = { x, y, z, w };

						const response = fetch('/api/add_quat', {
							method: 'POST',
							body: JSON.stringify({ x, y, z, w }),
							headers: {
								'content-type': 'application/json'
							}
						});
					}
				};
			} else {
				alert('No permissions to use sensors.');
			}
		});

		//@ts-ignore
		navigator.permissions.query({ name: 'accelerometer' }).then((result) => {
			if (result.state === 'denied') {
				console.log('Permission to use accelerometer sensor is denied.');
				return;
			}
			console.log('Permission to use accelerometer sensor is granted.');
			accelerometer_ok = true;
		});

		//@ts-ignore
		navigator.permissions.query({ name: 'gyroscope' }).then((result) => {
			if (result.state === 'denied') {
				console.log('Permission to use gyroscope sensor is denied.');
				return;
			}
			// Use the sensor.
			console.log('Permission to use gyroscope sensor is granted.');
			gyroscope_ok = true;
		});

		//@ts-ignore
		navigator.permissions.query({ name: 'geolocation' }).then((result) => {
			if (result.state === 'denied') {
				console.log('Permission to use geolocation sensor is denied.');
				return;
			}
			// Use the sensor.
			console.log('Permission to use geolocation sensor is granted.');
			geolocation_ok = true;
		});
	}

	let alpha = 0;
	onMount(() => {
		askForSensor();
		window.addEventListener('devicemotion', sensor_callback);
		window.addEventListener('deviceorientationabsolute', (o) => {
			let ev = o as DeviceOrientationEvent;
			// get head
			// alert(ev.alpha);
			alpha = ev.alpha ?? 0;
		});
	});
</script>

<main class="p-4">
	<button class="bg-green-100 p-4" on:click={askForSensor}>Ask for sensor</button>

	<div class="flex">
		<div class="flex-1">
			<h2>Accelerometer</h2>
			<p>{accelerometer_ok ? 'Permission granted' : 'Permission denied'}</p>

			<h2>Gyroscope</h2>
			<p>{gyroscope_ok ? 'Permission granted' : 'Permission denied'}</p>

			<h2>Geolocation</h2>
			<p>{geolocation_ok ? 'Permission granted' : 'Permission denied'}</p>

			<h2>Accelerometer</h2>
			<p>X: {last_acc.x.toFixed(2)}</p>
			<p>Y: {last_acc.y.toFixed(2)}</p>
			<p>Z: {last_acc.z.toFixed(2)}</p>

			<h2>Orientation</h2>
			<p>X: {last_quat.x.toFixed(2)}</p>
			<p>Y: {last_quat.y.toFixed(2)}</p>
			<p>Z: {last_quat.z.toFixed(2)}</p>
			<p>W: {last_quat.w.toFixed(2)}</p>

			<h2>Geolocation</h2>
			<p>Lat: {last_geo.lat.toFixed(2)}</p>
			<p>Lon: {last_geo.lon.toFixed(2)}</p>
			<p>Alt: {last_geo.alt.toFixed(2)}</p>

			<h2>Orientation</h2>
			<p>Alpha: {alpha.toFixed(2)}</p>
		</div>
		<div class="flex-1 bg-black p-2">
			<!-- Alpha is already in deg convert to rad -->
			<Compass heading={alpha * (Math.PI / 180)} />
		</div>
	</div>
</main>
