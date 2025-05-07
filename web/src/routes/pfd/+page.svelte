<script lang="ts">
	import PrimaryFlightDisplay from '$lib/components/Dashboard/PrimaryFlightDisplay/PrimaryFlightDisplay.svelte';
	// Add back imports and state
	import { onMount } from 'svelte';

	// Type for the fetched data
	type PfdData = {
		pitch: number;
		roll: number;
		heading: number;
		airspeed: number; // Even if unused by component, keep for type match
		altitude: number;
		latitude: number;
		longitude: number;
	};

	// State variables
	let pfdData = $state<PfdData | null>(null);
	let error = $state<string | null>(null);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	// Fetch data function
	async function fetchData() {
		try {
			const response = await fetch('/pfd/api');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			pfdData = await response.json();
			error = null;
		} catch (e: any) {
			console.error('Failed to fetch PFD data:', e);
			error = e.message || 'Failed to load data';
			pfdData = null; // Clear data on error
		}
	}

	// Fetch data on mount and set interval
	onMount(() => {
		fetchData();
		intervalId = setInterval(fetchData, 250);

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	});
</script>

<div class="p-4 flex flex-col items-center">
	<h1 class="text-2xl font-bold mb-4">PFD View (Ottawa)</h1>

	<!-- Add back conditional rendering -->
	{#if error}
		<div class="alert alert-error">
			<span>Error loading PFD data: {error}</span>
		</div>
	{:else if pfdData}
		<!-- Pass fetched data props to the component -->
		<PrimaryFlightDisplay {...pfdData} />
	{:else}
		<div class="flex justify-center items-center h-64">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/if}
</div>
