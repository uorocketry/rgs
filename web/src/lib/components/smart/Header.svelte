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
	import TimeCounter from '../dumb/CountdownTimer.svelte';

	function cmdBoxOpen() {
		commandBoxToggle.set({});
	}
</script>

<div class="navbar bg-primary text-primary-content font-mono">
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

		<div class="tooltip tooltip-bottom" data-tip="System Health">
			<a href="/health" class="btn btn-ghost normal-case text-xl">
				<i class="fa-solid fa-heart"></i>
			</a>
		</div>
	</div>
	<div class="navbar-end gap-2">
		<!-- Link Status -->
		<div class="tooltip tooltip-bottom" data-tip="Link Status">
			<button class="btn btn-accent normal-case text-xl">
				{#if $linkStatus?.connected}
					<i class="fa-solid fa-link text-green-500" />
				{:else}
					<i class="fa-solid fa-link-slash text-red-500" />
				{/if}
			</button>
		</div>

		<!-- RSSI -->
		<div class="tooltip tooltip-bottom" data-tip="RSSI">
			<label for="my-modal-4" class="btn btn-accent p-2 whitespace-nowrap">
				<i class="fa-solid fa-radio"></i>
				{padFloatToDecimalPlaces(roundToDecimalPlaces($linkStatus?.rssi ?? 0, 2), 2)}
			</label>
		</div>

		<div class="tooltip tooltip-bottom" data-tip="Vertical Velocity">
			<label for="my-modal-4" class="btn btn-accent p-2 whitespace-nowrap">
				<i class="fa-solid fa-arrow-up"></i>
				<span>
					{padFloatToDecimalPlaces(roundToDecimalPlaces($ekf?.velocity?.[2] ?? 0, 2), 2)} m/s
				</span>
			</label>
		</div>

		<div class="tooltip tooltip-bottom" data-tip="Speed">
			<label for="my-modal-4" class="btn btn-accent p-2 whitespace-nowrap">
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

		<!-- Total Distance traveled -->
		<div class="tooltip tooltip-bottom" data-tip="Total Distance Traveled">
			<label for="my-modal-4" class="btn btn-accent p-2 whitespace-nowrap">
				<i class="fa-solid fa-route"></i>
				{padFloatToDecimalPlaces(
					roundToDecimalPlaces(haversineDistance($launchPoint, $rocketPosition), 2),
					2
				)} km
			</label>
		</div>

		<!-- Relative Altitude -->
		<div class="tooltip tooltip-bottom" data-tip="Relative Altitude">
			<label for="my-modal-4" class="btn btn-accent p-2 whitespace-nowrap">
				<i class="fa-solid fa-mountain"></i>
				{String(Math.round($rocketAltitude - ($flightDirector?.relativeAltitude ?? 0))).padStart(
					4,
					'0'
				)} m
			</label>
		</div>

		<!-- Current State -->
		<div class="tooltip tooltip-bottom" data-tip="State">
			<label for="my-modal-4" class=" btn btn-accent btn-wide">
				{#key $state?.status}
					<span style="display: inline-block" in:fly={{ y: -25, duration: 100 }}>
						{formatCamelCase($state?.status ?? 'Unknown')}
					</span>
				{/key}
			</label>
		</div>

		<TimeCounter />
	</div>
</div>
