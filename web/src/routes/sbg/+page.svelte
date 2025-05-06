<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data } = $props<{ data: PageData }>();

	// Use $state for reactive updates from the API polling
	let sbgData = $state(data.sbgData);
	let lastUpdated = $state(new Date());
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Function to fetch latest data from the API
	async function fetchLatestData() {
		isLoading = true;
		error = null;
		try {
			const response = await fetch('/sbg/api');
			if (!response.ok) {
				throw new Error(`API Error: ${response.status} ${response.statusText}`);
			}
			const latestData = await response.json();
			// Only update if the timestamp has actually changed for a key source (e.g., EKF Nav)
			// This prevents unnecessary screen flicker if data hasn't changed yet
			if (latestData?.ekfNav?.time_stamp !== sbgData?.ekfNav?.time_stamp) {
				sbgData = latestData;
				lastUpdated = new Date();
			}
		} catch (err: any) {
			console.error('Failed to fetch latest SBG data:', err);
			error = err.message ?? 'An unknown error occurred while fetching data.';
		} finally {
			isLoading = false;
		}
	}

	// Set up polling on component mount
	onMount(() => {
		const intervalId = setInterval(fetchLatestData, 5000); // Poll every 5 seconds

		// Clear interval on component destroy
		return () => {
			clearInterval(intervalId);
		};
	});

	// Helper to format numbers, handling null/undefined
	function formatNum(value: number | null | undefined, decimals = 3): string {
		if (value === null || typeof value === 'undefined') return 'N/A';
		return value.toFixed(decimals);
	}

	// Helper to format time_stamp (assuming Unix epoch seconds)
	function formatTimestamp(ts: number | null | undefined): string {
		if (ts === null || typeof ts === 'undefined') return 'N/A';
		try {
			return new Date(ts * 1000).toLocaleString();
		} catch {
			return 'Invalid Date';
		}
	}
</script>

<svelte:head>
	<title>SBG Sensor Status</title>
	<meta name="description" content="Real-time SBG sensor data summary" />
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">SBG Sensor Summary</h1>

	<div class="mb-4 text-sm text-gray-600">
		Last updated: {lastUpdated.toLocaleString()}
		{#if isLoading}(updating...){/if}
	</div>

	{#if error}
		<div
			class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
			role="alert"
		>
			<strong class="font-bold">Error:</strong>
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<!-- EKF Navigation -->
		<div class="border p-4 rounded shadow">
			<h2 class="font-semibold mb-2">EKF Navigation</h2>
			<p>Timestamp: {formatTimestamp(sbgData.ekfNav?.time_stamp)}</p>
			<p>Status: {sbgData.ekfNav?.status ?? 'N/A'}</p>
			<p>
				Lat: {formatNum(sbgData.ekfNav?.position_latitude, 7)}&deg; (&plusmn;{formatNum(
					sbgData.ekfNav?.position_std_dev_latitude,
					2
				)}m)
			</p>
			<p>
				Lon: {formatNum(sbgData.ekfNav?.position_longitude, 7)}&deg; (&plusmn;{formatNum(
					sbgData.ekfNav?.position_std_dev_longitude,
					2
				)}m)
			</p>
			<p>
				Alt: {formatNum(sbgData.ekfNav?.position_altitude, 2)}m (&plusmn;{formatNum(
					sbgData.ekfNav?.position_std_dev_altitude,
					2
				)}m)
			</p>
			<p>
				Vel N/E/D: {formatNum(sbgData.ekfNav?.velocity_north)} / {formatNum(
					sbgData.ekfNav?.velocity_east
				)} / {formatNum(sbgData.ekfNav?.velocity_down)} m/s
			</p>
		</div>

		<!-- Air Data -->
		<div class="border p-4 rounded shadow">
			<h2 class="font-semibold mb-2">Air Data</h2>
			<p>Timestamp: {formatTimestamp(sbgData.air?.time_stamp)}</p>
			<p>Status: {sbgData.air?.status ?? 'N/A'}</p>
			<p>Abs Pressure: {formatNum(sbgData.air?.pressure_abs, 2)} Pa</p>
			<p>Altitude: {formatNum(sbgData.air?.altitude, 2)} m</p>
			<p>Diff Pressure: {formatNum(sbgData.air?.pressure_diff, 2)} Pa</p>
			<p>Airspeed: {formatNum(sbgData.air?.true_airspeed, 2)} m/s</p>
			<p>Temperature: {formatNum(sbgData.air?.air_temperature, 1)} &deg;C</p>
		</div>

		<!-- IMU Data -->
		<div class="border p-4 rounded shadow">
			<h2 class="font-semibold mb-2">IMU Data</h2>
			<p>Timestamp: {formatTimestamp(sbgData.imu?.time_stamp)}</p>
			<p>Status: {sbgData.imu?.status ?? 'N/A'}</p>
			<p>
				Accel X/Y/Z: {formatNum(sbgData.imu?.accelerometer_x)} / {formatNum(
					sbgData.imu?.accelerometer_y
				)} / {formatNum(sbgData.imu?.accelerometer_z)} m/s&sup2;
			</p>
			<p>
				Gyro X/Y/Z: {formatNum(sbgData.imu?.gyroscope_x)} / {formatNum(sbgData.imu?.gyroscope_y)} / {formatNum(
					sbgData.imu?.gyroscope_z
				)} rad/s
			</p>
			<p>Temp: {formatNum(sbgData.imu?.temperature, 1)} &deg;C</p>
		</div>

		<!-- GPS Position -->
		<div class="border p-4 rounded shadow">
			<h2 class="font-semibold mb-2">GPS Position</h2>
			<p>Timestamp: {formatTimestamp(sbgData.gpsPos?.time_stamp)}</p>
			<p>Status: {sbgData.gpsPos?.status ?? 'N/A'}</p>
			<p>
				Lat: {formatNum(sbgData.gpsPos?.latitude, 7)}&deg; (&plusmn;{formatNum(
					sbgData.gpsPos?.latitude_accuracy,
					2
				)}m)
			</p>
			<p>
				Lon: {formatNum(sbgData.gpsPos?.longitude, 7)}&deg; (&plusmn;{formatNum(
					sbgData.gpsPos?.longitude_accuracy,
					2
				)}m)
			</p>
			<p>
				Alt: {formatNum(sbgData.gpsPos?.altitude, 2)}m (&plusmn;{formatNum(
					sbgData.gpsPos?.altitude_accuracy,
					2
				)}m)
			</p>
			<p>SVs Used: {sbgData.gpsPos?.num_sv_used ?? 'N/A'}</p>
		</div>

		<!-- GPS Velocity -->
		<div class="border p-4 rounded shadow">
			<h2 class="font-semibold mb-2">GPS Velocity</h2>
			<p>Timestamp: {formatTimestamp(sbgData.gpsVel?.time_stamp)}</p>
			<p>Status: {sbgData.gpsVel?.status ?? 'N/A'}</p>
			<p>
				Vel N/E/D: {formatNum(sbgData.gpsVel?.velocity_north)} / {formatNum(
					sbgData.gpsVel?.velocity_east
				)} / {formatNum(sbgData.gpsVel?.velocity_down)} m/s
			</p>
			<p>
				Course: {formatNum(sbgData.gpsVel?.course, 2)}&deg; (&plusmn;{formatNum(
					sbgData.gpsVel?.course_acc,
					2
				)}&deg;)
			</p>
		</div>

		<!-- Add other sections as needed (e.g., UTC Time, EKF Quaternion) -->
	</div>
</div>
