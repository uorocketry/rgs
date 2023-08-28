<script lang="ts">
	import {
		formatCamelCase,
		haversineDistance,
		padFloatToDecimalPlaces,
		roundToDecimalPlaces
	} from '$lib/common/utils';
	import { flightDirector, launchPoint } from '$lib/realtime/flightDirector';
	import { rocketAltitude, rocketPosition } from '$lib/realtime/gps';
	import { ekf, linkStatus, state } from '$lib/realtime/linkStatus';
	import { commandBoxToggle as commandBoxToggle } from '$lib/stores';
	import { fly } from 'svelte/transition';
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
	</div>
	<div class="navbar-end gap-2">
		<!-- Link Status -->
		<div class="tooltip tooltip-bottom" data-tip="Link Status">
			<button class="btn normal-case text-xl">
				{#if $linkStatus?.connected}
					<i class="fa-solid fa-link text-green-500" />
				{:else}
					<i class="fa-solid fa-link-slash text-red-500" />
				{/if}
			</button>
		</div>

		<div class="font-mono">
			<div class="tooltip tooltip-bottom" data-tip="Vertical Velocity">
				<label for="my-modal-4" class=" btn">
					<i class="fa-solid fa-arrow-up"></i>
					{padFloatToDecimalPlaces(roundToDecimalPlaces($ekf?.velocity?.[2] ?? 0, 2), 2)} m/s
				</label>
			</div>
		</div>

		<div class="font-mono">
			<div class="tooltip tooltip-bottom" data-tip="Speed">
				<label for="my-modal-4" class=" btn">
					<i class="fa-solid fa-gauge"></i>
					{padFloatToDecimalPlaces(
						roundToDecimalPlaces(
							Math.sqrt(
								($ekf?.velocity?.[0] ?? 0) ** 2 +
									($ekf?.velocity?.[1] ?? 0) ** 2 +
									($ekf?.velocity?.[2] ?? 0) ** 2
							),
							2
						),
						2
					)} m/s
				</label>
			</div>
		</div>

		<!-- Total Distance traveled -->
		<div class="font-mono">
			<div class="tooltip tooltip-bottom" data-tip="Total Distance Traveled">
				<label for="my-modal-4" class=" btn">
					<i class="fa-solid fa-route"></i>
					{padFloatToDecimalPlaces(
						roundToDecimalPlaces(haversineDistance($launchPoint, $rocketPosition), 2),
						2
					)} km
				</label>
			</div>
		</div>

		<!-- Relative Altitude -->
		<div class="font-mono">
			<div class="tooltip tooltip-bottom" data-tip="Relative Altitude">
				<label for="my-modal-4" class=" btn">
					<i class="fa-solid fa-mountain"></i>
					{Math.round($rocketAltitude - ($flightDirector?.relativeAltitude ?? 0))} m
				</label>
			</div>
		</div>

		<!-- Current State -->
		<div class="font-mono">
			<div class="tooltip tooltip-bottom" data-tip="State">
				<label for="my-modal-4" class=" btn btn-wide">
					{#key $state?.status}
						<span style="display: inline-block" in:fly={{ y: -25, duration: 100 }}>
							{formatCamelCase($state?.status ?? 'Unknown')}
						</span>
					{/key}
				</label>
			</div>
		</div>

		<TimeCounter />
	</div>
</div>
