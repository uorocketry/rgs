<script lang="ts">
	import { linkStatus } from '$lib/realtime/linkStatus';
	import { commandBoxToggle as commandBoxToggle } from '$lib/stores';
	import TimeCounter from './TimeCounter.svelte';

	function cmdBoxOpen() {
		commandBoxToggle.set({});
	}
</script>

<div class="navbar">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost normal-case text-xl">RGS</a>
		<div class="tooltip tooltip-bottom" data-tip="Dashboard">
			<a href="/dashboard" class="btn btn-ghost normal-case text-xl">
				<i class="fa-solid fa-chart-line" />
			</a>
		</div>

		<div class="tooltip tooltip-bottom" data-tip="Commands">
			<button class="btn btn-ghost normal-case text-xl" on:click={cmdBoxOpen}>
				<i class="fa-solid fa-search" />
			</button>
		</div>

		<div class="tooltip tooltip-bottom" data-tip="Status">
			<button class="btn btn-ghost normal-case text-xl">
				{#if $linkStatus?.connected}
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
