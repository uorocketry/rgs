<script lang="ts">
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
</script>

<!-- <div class="navbar bg-primary text-primary-content font-mono">
	<div class="navbar-start">
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
		<div class="tooltip tooltip-bottom" data-tip="Link Status">
			<button class="btn btn-accent normal-case text-xl">
				{#if $linkStatus?.connected}
					<i class="fa-solid fa-link text-green-500" />
				{:else}
					<i class="fa-solid fa-link-slash text-red-500" />
				{/if}
			</button>
		</div>

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

		<div class="tooltip tooltip-bottom" data-tip="Total Distance Traveled">
			<label for="my-modal-4" class="btn btn-accent p-2 whitespace-nowrap">
				<i class="fa-solid fa-route"></i>
				{padFloatToDecimalPlaces(
					roundToDecimalPlaces(haversineDistance($launchPoint, $rocketPosition), 2),
					2
				)} km
			</label>
		</div>

		<div class="tooltip tooltip-bottom" data-tip="Relative Altitude">
			<label for="my-modal-4" class="btn btn-accent p-2 whitespace-nowrap">
				<i class="fa-solid fa-mountain"></i>
				{String(Math.round($rocketAltitude - ($flightDirector?.relativeAltitude ?? 0))).padStart(
					4,
					'0'
				)} m
			</label>
		</div>

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
</div> -->
<span class="bg-primary-hover-token"></span>

<AppRail width="w-12" border="border-r border-surface-500" background="bg-surface-100-800-token">
	<AppRailAnchor href="/dashboard" title="Dashboard" class="opacity-50 hover:opacity-100">
		<i class="text-surface-800-100-token fas fa-chart-line" />
	</AppRailAnchor>
	<AppRailAnchor href="/health" title="System Health" class="opacity-50 hover:opacity-100">
		<i class="text-surface-800-100-token fas fa-heart"></i>
	</AppRailAnchor>
	<svelte:fragment slot="trail">
		<AppRailAnchor title="Help" class="opacity-50 hover:opacity-100">
			<i class="text-surface-800-100-token fas fa-question"></i>
		</AppRailAnchor>
		<AppRailAnchor href="/settings" title="Settings" class="opacity-50 hover:opacity-100">
			<i class="text-surface-800-100-token fas fa-cog"></i>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>

<style>
	i {
		@apply text-xl;
	}
</style>
