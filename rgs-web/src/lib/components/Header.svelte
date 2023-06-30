<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { theme } from '$lib/common/utils';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { onSocket } from '$lib/common/socket';
	import TimeCounter from './TimeCounter.svelte';

	let themeState = false;
	let socketOK = writable(false);
	onSocket('connect', () => {
		socketOK.set(true);
	});

	onSocket('disconnect', () => {
		socketOK.set(false);
	});
</script>

<div class="navbar">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost normal-case text-xl">RGS</a>
		<div class="tooltip tooltip-bottom" data-tip="Dashboard">
			<a href="/dashboard" class="btn btn-ghost normal-case text-xl">
				<i class="fa-solid fa-chart-line" />
			</a>
		</div>

		<div class="tooltip tooltip-bottom" data-tip="Settings">
			<a href="/settings" class="btn btn-ghost normal-case text-xl">
				<i class="fa-solid fa-gear" />
			</a>
		</div>

		<div class="tooltip tooltip-bottom" data-tip="Status">
			<button class="btn btn-ghost normal-case text-xl">
				{#if $socketOK}
					<i class="fa-solid fa-link text-green-500" />
				{:else}
					<i class="fa-solid fa-link-slash text-red-500" />
				{/if}
			</button>
		</div>
	</div>
	<div class="navbar-end">
		<TimeCounter />
	</div>
</div>
