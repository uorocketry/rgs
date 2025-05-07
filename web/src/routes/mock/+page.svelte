<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { onMount } from 'svelte';
	// onMount is fine for effects that need cleanup

	// --- State for the form inputs ---
	let time_stamp = $state(Math.floor(Date.now() / 1000));
	let accelerometer_x = $state(0.1);
	let accelerometer_y = $state(0.2);
	let accelerometer_z = $state(9.81);
	let gyroscope_alpha = $state(0); // Alpha for device orientation
	let gyroscope_beta = $state(0); // Beta
	let gyroscope_gamma = $state(0); // Gamma
	let temperature = $state(25.5);
	// Optional fields, can be left empty or have defaults
	let delta_velocity_x = $state(0);
	let delta_velocity_y = $state(0);
	let delta_velocity_z = $state(0);
	let delta_angle_x = $state(0);
	let delta_angle_y = $state(0);
	let delta_angle_z = $state(0);

	let isLoading = $state(false);
	let isListeningToSensors = $state(false);
	let sensorError = $state<string | null>(null);

	// --- Sensor Handling ---
	function roundToTwo(num: number | null | undefined): number {
		if (num === null || num === undefined) return 0; // Or handle as per your preference, e.g., return num
		return parseFloat(num.toFixed(2));
	}

	function handleDeviceMotion(event: DeviceMotionEvent) {
		time_stamp = Math.floor(Date.now() / 1000);
		if (event.accelerationIncludingGravity) {
			accelerometer_x = roundToTwo(event.accelerationIncludingGravity.x);
			accelerometer_y = roundToTwo(event.accelerationIncludingGravity.y);
			accelerometer_z = roundToTwo(event.accelerationIncludingGravity.z);
		}
		// event.acceleration for acceleration without gravity if needed
		// event.rotationRate for gyroscope if preferred over deviceorientation
		// event.interval for sample rate
	}

	function handleDeviceOrientation(event: DeviceOrientationEvent) {
		time_stamp = Math.floor(Date.now() / 1000);
		gyroscope_alpha = roundToTwo(event.alpha);
		gyroscope_beta = roundToTwo(event.beta);
		gyroscope_gamma = roundToTwo(event.gamma);
	}

	async function startSensorListeners() {
		sensorError = null;
		if (
			typeof DeviceMotionEvent !== 'undefined' &&
			typeof (DeviceMotionEvent as any).requestPermission === 'function'
		) {
			try {
				const motionPermission = await (DeviceMotionEvent as any).requestPermission();
				if (motionPermission !== 'granted') {
					sensorError = 'Motion sensor permission denied.';
					toastStore.error(sensorError);
					return;
				}
			} catch (err: any) {
				sensorError = `Error requesting motion permission: ${err.message}`;
				toastStore.error(sensorError);
				console.error(sensorError, err);
				return;
			}
		}
		if (
			typeof DeviceOrientationEvent !== 'undefined' &&
			typeof (DeviceOrientationEvent as any).requestPermission === 'function'
		) {
			try {
				const orientationPermission = await (DeviceOrientationEvent as any).requestPermission();
				if (orientationPermission !== 'granted') {
					sensorError = 'Orientation sensor permission denied.';
					toastStore.error(sensorError);
					return;
				}
			} catch (err: any) {
				sensorError = `Error requesting orientation permission: ${err.message}`;
				toastStore.error(sensorError);
				console.error(sensorError, err);
				return;
			}
		}

		if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', handleDeviceMotion, true);
		} else {
			sensorError = 'Device Motion API not available.';
		}
		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', handleDeviceOrientation, true);
		} else {
			const currentError = sensorError ? sensorError + ' ' : '';
			sensorError = currentError + 'Device Orientation API not available.';
		}

		if (!sensorError) {
			isListeningToSensors = true;
			toastStore.info('Started listening to device sensors.');
		} else {
			toastStore.error(sensorError);
		}
	}

	function stopSensorListeners() {
		window.removeEventListener('devicemotion', handleDeviceMotion, true);
		window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
		isListeningToSensors = false;
		toastStore.info('Stopped listening to device sensors.');
	}

	onMount(() => {
		// Cleanup listeners when component is unmounted
		return () => {
			if (isListeningToSensors) {
				stopSensorListeners();
			}
		};
	});

	async function handleSubmit() {
		isLoading = true;
		try {
			const payload = {
				time_stamp,
				status: 'VALID',
				// Using device orientation alpha, beta, gamma as direct substitutes for gyro x,y,z
				// This is a simplification; true gyroscope data (rotationRate) might be preferred
				// or a more complex conversion from orientation to angular velocity might be needed for strict accuracy.
				accelerometer_x: accelerometer_x || null,
				accelerometer_y: accelerometer_y || null,
				accelerometer_z: accelerometer_z || null,
				gyroscope_x: gyroscope_alpha || null, // Mapped alpha to x
				gyroscope_y: gyroscope_beta || null, // Mapped beta to y
				gyroscope_z: gyroscope_gamma || null, // Mapped gamma to z
				delta_velocity_x: delta_velocity_x || null,
				delta_velocity_y: delta_velocity_y || null,
				delta_velocity_z: delta_velocity_z || null,
				delta_angle_x: delta_angle_x || null,
				delta_angle_y: delta_angle_y || null,
				delta_angle_z: delta_angle_z || null,
				temperature: temperature || null
			};

			const response = await fetch('/mock/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || `Failed to submit mock data: ${response.status}`);
			}

			toastStore.success(`Mock data inserted! Row ID: ${result.rowId}`);
			// Optionally reset form fields here if not listening to sensors
			if (!isListeningToSensors) {
				time_stamp = Math.floor(Date.now() / 1000);
			}
		} catch (err: any) {
			toastStore.error(err.message || 'An unknown error occurred.');
			console.error('Submission error:', err);
		} finally {
			isLoading = false;
		}
	}

	// Function to add unique IDs for accessibility
	function id(name: string) {
		return `mock-${name}`;
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-6">Mock SBG IMU Data Inserter</h1>

	<div class="mb-4 p-4 card bg-base-200 shadow">
		<h2 class="text-xl font-semibold mb-2">Device Sensors Control</h2>
		{#if sensorError}
			<div class="alert alert-warning text-sm">
				<span>Sensor Error: {sensorError}</span>
			</div>
		{/if}
		{#if !isListeningToSensors}
			<button class="btn btn-accent" onclick={startSensorListeners}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 mr-2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5"
					/>
				</svg>
				Use Device Sensors
			</button>
		{:else}
			<button class="btn btn-warning" onclick={stopSensorListeners}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 mr-2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
					/>
				</svg>
				Stop Device Sensors
			</button>
		{/if}
		<p class="text-xs mt-2 text-base-content/70">
			Note: Uses device orientation (alpha, beta, gamma) for gyroscope fields. May require
			permissions (especially on iOS). Accelerometer data includes gravity.
		</p>
	</div>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form
				onsubmit={(event) => {
					event.preventDefault();
					handleSubmit();
				}}
				class="space-y-4"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="label" for={id('timestamp')}>
							<span class="label-text">Timestamp (Unix Epoch Seconds)</span>
						</label>
						<input
							id={id('timestamp')}
							type="number"
							class="input input-bordered w-full"
							bind:value={time_stamp}
							required
							readonly={isListeningToSensors}
						/>
					</div>
				</div>

				<h3 class="text-lg font-semibold pt-2">Accelerometers (m/s²)</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="label" for={id('accel_x')}>
							<span class="label-text">Accelerometer X</span>
						</label>
						<input
							id={id('accel_x')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={accelerometer_x}
							readonly={isListeningToSensors}
						/>
					</div>
					<div>
						<label class="label" for={id('accel_y')}>
							<span class="label-text">Accelerometer Y</span>
						</label>
						<input
							id={id('accel_y')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={accelerometer_y}
							readonly={isListeningToSensors}
						/>
					</div>
					<div>
						<label class="label" for={id('accel_z')}>
							<span class="label-text">Accelerometer Z</span>
						</label>
						<input
							id={id('accel_z')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={accelerometer_z}
							readonly={isListeningToSensors}
						/>
					</div>
				</div>

				<h3 class="text-lg font-semibold pt-2">Gyroscopes (Device Orientation α, β, γ)</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="label" for={id('gyro_x')}>
							<span class="label-text">Gyro X (Alpha °)</span>
						</label>
						<input
							id={id('gyro_x')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={gyroscope_alpha}
							readonly={isListeningToSensors}
						/>
					</div>
					<div>
						<label class="label" for={id('gyro_y')}>
							<span class="label-text">Gyro Y (Beta °)</span>
						</label>
						<input
							id={id('gyro_y')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={gyroscope_beta}
							readonly={isListeningToSensors}
						/>
					</div>
					<div>
						<label class="label" for={id('gyro_z')}>
							<span class="label-text">Gyro Z (Gamma °)</span>
						</label>
						<input
							id={id('gyro_z')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={gyroscope_gamma}
							readonly={isListeningToSensors}
						/>
					</div>
				</div>

				<h3 class="text-lg font-semibold pt-2">Delta Velocity (m/s) - Manual Input</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="label" for={id('dv_x')}>
							<span class="label-text">Delta Vel. X</span>
						</label>
						<input
							id={id('dv_x')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={delta_velocity_x}
						/>
					</div>
					<div>
						<label class="label" for={id('dv_y')}>
							<span class="label-text">Delta Vel. Y</span>
						</label>
						<input
							id={id('dv_y')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={delta_velocity_y}
						/>
					</div>
					<div>
						<label class="label" for={id('dv_z')}>
							<span class="label-text">Delta Vel. Z</span>
						</label>
						<input
							id={id('dv_z')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={delta_velocity_z}
						/>
					</div>
				</div>

				<h3 class="text-lg font-semibold pt-2">Delta Angle (rad) - Manual Input</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="label" for={id('da_x')}>
							<span class="label-text">Delta Angle X</span>
						</label>
						<input
							id={id('da_x')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={delta_angle_x}
						/>
					</div>
					<div>
						<label class="label" for={id('da_y')}>
							<span class="label-text">Delta Angle Y</span>
						</label>
						<input
							id={id('da_y')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={delta_angle_y}
						/>
					</div>
					<div>
						<label class="label" for={id('da_z')}>
							<span class="label-text">Delta Angle Z</span>
						</label>
						<input
							id={id('da_z')}
							type="number"
							step="any"
							class="input input-bordered w-full"
							bind:value={delta_angle_z}
						/>
					</div>
				</div>

				<div class="form-control w-full max-w-xs">
					<label class="label" for={id('temperature')}>
						<span class="label-text">Temperature (°C)</span>
					</label>
					<input
						id={id('temperature')}
						type="number"
						step="any"
						class="input input-bordered w-full"
						bind:value={temperature}
						readonly={isListeningToSensors}
					/>
				</div>

				<div class="card-actions justify-end pt-4">
					<button type="submit" class="btn btn-primary" disabled={isLoading}>
						{#if isLoading}
							<span class="loading loading-spinner"></span>
							Submitting...
						{:else}
							Insert Mock IMU Data
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
