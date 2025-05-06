<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(async () => {
		console.log('Page data:', data);
	});

	const serialConfigureFunction = (() => {
		console.log('Form submitted');

		return async (result) => {
			console.log('Form result', result.result);
		};
	}) satisfies SubmitFunction;
</script>

<main class="p-2 gap-2 flex flex-col">
	<form
		class="card p-4 w-full text-token space-y-4"
		method="POST"
		use:enhance={serialConfigureFunction}
		action="?/serial_configure"
	>
		<h4 class="h4">Preferred Serial Device</h4>
		<select class="select max-w-48" name="device">
			{#each data.devices as device}
				<option value={device}>{device}</option>
			{/each}
		</select>
		<button class="btn variant-soft-primary" type="submit">Submit</button>
	</form>

	<div class="card flex flex-col p-4 gap-2">
		<h4 class="h4 text-success">
			{#if !data.serialStatus.isRunning}
				Serial is not running
			{:else}
				Serial is currently running
			{/if}
		</h4>
		<div class="flex gap-4 items-center">
			<form method="POST" action="?/serial_start">
				<button
					class="btn variant-soft-primary"
					type="submit"
					disabled={data.serialStatus.isRunning}
				>
					Start Serial
				</button>
			</form>

			<form method="POST" action="?/serial_stop">
				<button
					class="btn variant-soft-primary"
					type="submit"
					disabled={!data.serialStatus.isRunning}
				>
					Stop Serial
				</button>
			</form>
		</div>
	</div>

	<div class="card flex flex-col p-4 gap-2">
		<h4 class="h4 text-success">
			{#if !data.randomIsRunning}
				Random is not running
			{:else}
				Random is currently running
			{/if}
		</h4>
		<div class="flex gap-4 items-center">
			<form method="POST" action="?/random_start">
				<button class="btn variant-soft-primary" type="submit" disabled={data.randomIsRunning}>
					Start Random
				</button>
			</form>

			<form method="POST" action="?/random_stop">
				<button class="btn variant-soft-primary" type="submit" disabled={!data.randomIsRunning}>
					Stop Random
				</button>
			</form>
		</div>
	</div>
</main>
