<script lang="ts">
	import { page } from '$app/stores';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
</script>

<span class="bg-primary-hover-token"></span>

<AppRail width="w-12" border="border-r border-surface-500" background="bg-surface-100-800-token">
	<AppRailAnchor href="/dashboard" selected={$page.url.pathname === '/dashboard'} title="Dashboard">
		<i class="text-xl text-surface-800-100-token fas fa-chart-line" />
	</AppRailAnchor>
	<AppRailAnchor href="/health" selected={$page.url.pathname === '/health'} title="System Health">
		<i class="text-xl text-surface-800-100-token fas fa-heart"></i>
	</AppRailAnchor>
	<AppRailAnchor href="/comm" selected={$page.url.pathname === '/comm'} title="Hydra Provider">
		<i class="text-xl text-surface-800-100-token fas fa-broadcast-tower"></i>
	</AppRailAnchor>
	<AppRailAnchor href="/db" selected={$page.url.pathname === '/db'} title="Data">
		<i class="text-xl text-surface-800-100-token fas fa-database"></i>
	</AppRailAnchor>

	<svelte:fragment slot="trail">
		<AppRailAnchor href="/help" title="Help">
			<i class="text-xl text-surface-800-100-token fas fa-question"></i>
		</AppRailAnchor>
		<AppRailAnchor href="/settings" selected={$page.url.pathname === '/settings'} title="Settings">
			<i class="text-xl text-surface-800-100-token fas fa-cog"></i>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>
