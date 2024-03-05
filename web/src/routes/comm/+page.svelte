<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	// 	let data: {
	//     devices: string[];
	// }

	onMount(async () => {
		console.log('Page data:', data);
	});

	const selectDeviceFunction = ((input) => {
		console.log('Form submitted');

		return async (result) => {
			console.log('Form result', result.result);
		};
	}) satisfies SubmitFunction;

	const selectModeFunction = ((input) => {
		console.log('Selecting mode:', input.formData);

		return async (result) => {
			console.log('Form result', result.result);
		};
	}) satisfies SubmitFunction;
</script>

<main class="p-2 gap-2 flex flex-col">
	<form
		class="card p-4 w-full text-token space-y-4"
		method="POST"
		use:enhance={selectDeviceFunction}
		action="?/select_device"
	>
		<h4 class="h4">Preferred Serial Device</h4>
		<!-- string[] select for device -->
		<select class="select max-w-48" name="device">
			{#each data.devices as device}
				<option value={device}>{device}</option>
			{/each}
		</select>
		<button class="btn variant-soft-primary" type="submit">Submit</button>
	</form>

	<!-- Select if should use random or serial port -->
	<form
		class="card p-4 w-full text-token space-y-4"
		method="POST"
		use:enhance={selectModeFunction}
		action="?/select_mode"
	>
		<h4 class="h4">Data Mode</h4>
		<!-- string[] select for mode -->
		<select class="select max-w-48" name="mode">
			<option value="random">Random</option>
			<option value="serial">Serial</option>
		</select>
		<button class="btn variant-soft-primary" type="submit">Submit</button>
	</form>
</main>
