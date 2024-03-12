<script lang="ts">
	import { onMount } from 'svelte';
	import { gqlClient } from '$lib/stores';
	import { InsertQuaternionDocument } from './types';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let toastStore = getToastStore();

	let accelerometer_ok = false;
	let gyroscope_ok = false;
	let geolocation_ok = false;

	let last_quat = { x: 0, y: 0, z: 0, w: 0 };
	let last_acc = { x: 0, y: 0, z: 0 };
	let last_geo = { lat: 0, lon: 0, alt: 0 };

	let shouldMock = false;

	let sensor_callback = (event: DeviceMotionEvent) => {
		if (event.acceleration) {
			last_acc = {
				x: event.acceleration.x ?? 0,
				y: event.acceleration.y ?? 0,
				z: event.acceleration.z ?? 0
			};
		}
	};

	let alpha = 0;
	onMount(() => {
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

				sensor.onreading = async () => {
					console.log('Sensor reading');
					console.log(sensor.quaternion);
					if (sensor.quaternion) {
						console.log('Sensor reading');

						let x = sensor.quaternion[0] ?? 0;
						let y = sensor.quaternion[1] ?? 0;
						let z = sensor.quaternion[2] ?? 0;
						let w = sensor.quaternion[3] ?? 0;

						last_quat = { x, y, z, w };

						if (!shouldMock) return;

						const result = await gqlClient.mutation(InsertQuaternionDocument, {
							x,
							y,
							z,
							w
						});

						if (result.error) {
							const textWrapper = (message: string) => {
								return `<span class="text-sm">${message}</span>`;
							};

							toastStore.trigger({
								background: 'variant-filled-error',
								classes: 'text-sm',
								message: textWrapper(result.error.message)
							});
						}
					}
				};
			} else {
				toastStore.trigger({
					background: 'variant-filled-error',
					classes: 'text-sm',
					message: 'No permissions to use sensors.'
				});
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

		window.addEventListener('devicemotion', sensor_callback);

		let set_alpha = (o: Event) => {
			let ev = o as DeviceOrientationEvent;
			alpha = ev.alpha ?? 0;
		};
		window.addEventListener('deviceorientationabsolute', set_alpha);

		// Request screen to stay on
		if ('wakeLock' in navigator) {
			navigator.wakeLock.request('screen').catch((err) => {
				toastStore.trigger({
					background: 'variant-filled-error',
					classes: 'text-sm',
					message: 'Error while trying to keep screen on.'
				});
			});
		}

		return () => {
			window.removeEventListener('devicemotion', sensor_callback);
			window.removeEventListener('deviceorientationabsolute', set_alpha);
			sensor.stop();
		};
	});
</script>

<main class="p-4">
	<button
		class="btn w-full
		h-32
		{!shouldMock ? 'variant-filled-error' : 'variant-filled-success'}
	
	"
		on:click={() => (shouldMock = !shouldMock)}
	>
		{!shouldMock ? 'Not mocking' : 'Mocking'}
	</button>

	<div class="flex">
		<div class="flex-1">
			<h2 class="text-xl font-bold">Accelerometer</h2>
			<table class="table-auto">
				<tbody>
					<tr>
						<td>Permission:</td>
						<td>{accelerometer_ok ? 'Granted' : 'Denied'}</td>
					</tr>
					<tr>
						<td>X:</td>
						<td>{last_acc.x.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Y:</td>
						<td>{last_acc.y.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Z:</td>
						<td>{last_acc.z.toFixed(2)}</td>
					</tr>
				</tbody>
			</table>

			<h2 class="text-xl font-bold">Gyroscope</h2>
			<table class="table-auto">
				<tbody>
					<tr>
						<td>Permission:</td>
						<td>{gyroscope_ok ? 'Granted' : 'Denied'}</td>
					</tr>
				</tbody>
			</table>

			<h2 class="text-xl font-bold">Geolocation</h2>
			<table class="table-auto">
				<tbody>
					<tr>
						<td>Permission:</td>
						<td>{geolocation_ok ? 'Granted' : 'Denied'}</td>
					</tr>
					<tr>
						<td>Lat:</td>
						<td>{last_geo.lat.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Lon:</td>
						<td>{last_geo.lon.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Alt:</td>
						<td>{last_geo.alt.toFixed(2)}</td>
					</tr>
				</tbody>
			</table>

			<h2 class="text-xl font-bold">Orientation</h2>
			<table class="table-auto">
				<tbody>
					<tr>
						<td>X:</td>
						<td>{last_quat.x.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Y:</td>
						<td>{last_quat.y.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Z:</td>
						<td>{last_quat.z.toFixed(2)}</td>
					</tr>
					<tr>
						<td>W:</td>
						<td>{last_quat.w.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Alpha:</td>
						<td>{alpha.toFixed(2)}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</main>
