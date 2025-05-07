<script lang="ts">
	import { Quaternion, Vector3, MathUtils, Euler } from 'three';
	import NavBall from '$lib/components/Navball/NavBall.svelte';
	import HeadingCompass from '$lib/components/HeadingCompass/HeadingCompass.svelte';
	import { onMount } from 'svelte';

	// State for IMU data
	let imuData = $state<any>(null);
	let error = $state<string | null>(null);

	// Create a default rotation for the navball
	let targetRotation = $derived(
		new Quaternion().setFromEuler(
			new Euler(
				MathUtils.degToRad(imuData?.gyroscope_x || 0),
				MathUtils.degToRad(imuData?.gyroscope_y || 0),
				MathUtils.degToRad(imuData?.gyroscope_z || 0),
				'XYZ'
			)
		)
	);
	// Get the pitch and roll from the quaternion
	let upTransformed = $derived(new Vector3(0, 1, 0).applyQuaternion(targetRotation));
	let pitch = $derived(MathUtils.radToDeg(Math.asin(upTransformed.y)));
	let heading = $derived(
		(MathUtils.radToDeg(Math.atan2(upTransformed.x, upTransformed.z)) + 360 + 90) % 360
	);
	let transformed = $derived(new Vector3(0, 0, -1).applyQuaternion(targetRotation));
	let roll = $derived(MathUtils.radToDeg(Math.atan2(transformed.x, transformed.z) + Math.PI));

	// Function to update rotation from IMU data
	function updateRotationFromImu() {
		// targetRotation = targetRotation; // Removed as new Quaternion instance is assigned
	}

	// Set up SSE
	let eventSource: EventSource;
	onMount(() => {
		eventSource = new EventSource('/navball/api');

		eventSource.onmessage = (event) => {
			try {
				imuData = JSON.parse(event.data);
				updateRotationFromImu();
				error = null; // Clear previous errors on successful message
			} catch (e: any) {
				error = `Error parsing IMU data: ${e.message}`;
				console.error('Error parsing IMU data:', e);
			}
		};

		eventSource.onerror = (err) => {
			console.error('EventSource failed:', err);
			error = 'Connection to server lost. Attempting to reconnect...';
			// EventSource attempts to reconnect automatically by default
			// You could close it here if you want to stop retrying: eventSource.close();
		};

		return () => {
			if (eventSource) {
				eventSource.close();
			}
		};
	});
</script>

<div class="h-full w-full bg-base-300 relative">
	<div class="z-10 absolute top-2 left-2 bg-base-100 p-4 rounded-box shadow-lg">
		<div class="stats stats-vertical bg-base-200">
			<div class="stat">
				<div class="stat-title text-base-content">Roll</div>
				<div class="stat-value text-primary">{roll.toFixed(2)}°</div>
			</div>
			<div class="stat">
				<div class="stat-title text-base-content">Pitch</div>
				<div class="stat-value text-secondary">{pitch.toFixed(2)}°</div>
			</div>
			<div class="stat">
				<div class="stat-title text-base-content">Pointing</div>
				<div class="stat-value text-accent">{pitch > 0 ? 'Up' : 'Down'}</div>
			</div>
			{#if imuData}
				<div class="stat">
					<div class="stat-title text-base-content">Status</div>
					<div class="stat-value text-info">{imuData.status}</div>
				</div>
			{/if}
		</div>
	</div>

	{#if error}
		<div class="alert alert-error absolute top-2 right-2 z-20">
			<span>{error}</span>
		</div>
	{/if}

	<div class="absolute bg-base-300 h-full w-full"></div>

	<div class="z-0 absolute inset-0">
		<NavBall {targetRotation} />
	</div>

	<div class="z-0 absolute h-full w-full pointer-events-none">
		<HeadingCompass heading={(heading * Math.PI) / 180} />
	</div>
</div>
