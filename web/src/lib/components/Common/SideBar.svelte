<script lang="ts">
	import { page } from '$app/stores';
	// import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton'; // Removed Skeleton imports

	type TabItem = {
		href: string;
		tip: string;
		icon: string; // FontAwesome class
	};

	const TABS: TabItem[] = [
		{ href: '/health', tip: 'System Health', icon: 'fas fa-heart' },
		{ href: '/comm', tip: 'Hydra Provider', icon: 'fas fa-broadcast-tower' },
		{ href: '/mock', tip: 'Mock', icon: 'fas fa-masks-theater' },
		{ href: '/sbg', tip: 'SBG Sensors', icon: 'fas fa-satellite' },
		{ href: '/commands', tip: 'Commands', icon: 'fas fa-terminal' },
		{ href: '/pfd', tip: 'PFD', icon: 'fas fa-plane' },
		{ href: '/navball', tip: 'Navball', icon: 'fas fa-compass' },
		{ href: '/radio', tip: 'Radio', icon: 'fas fa-signal' },
		{ href: '/help', tip: 'Help', icon: 'fas fa-question' },
		{ href: '/utils', tip: 'Utilities', icon: 'fas fa-tools' },
		{ href: '/settings', tip: 'Settings', icon: 'fas fa-cog' },
	];
</script>

<!-- Using DaisyUI Menu component -->
<ul class="menu bg-base-200 w-16 min-h-full p-2 flex flex-col items-center gap-2">
	<!-- Top Section -->
	<!-- Removed Dashboard Link -->
	<!-- 
    <li>
		<a
			href="/dashboard"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/dashboard'}
			data-tip="Dashboard"
			aria-label="Dashboard"
		>
			<i class="fas fa-chart-line text-xl"></i>
		</a>
	</li> 
    -->
	{#each TABS as tab}
		<li>
			<a
				href={tab.href}
				class="tooltip tooltip-right"
				class:active={$page.url.pathname === tab.href || (tab.href === '/utils' && $page.url.pathname.startsWith('/utils'))}
				data-tip={tab.tip}
				aria-label={tab.tip}
			>
				<i class={`${tab.icon} text-xl`}></i>
			</a>
		</li>
	{/each}

	<!-- Bottom Section (formerly trail slot) -->
	<div class="flex-grow"></div>
	<!-- Spacer to push items down -->
</ul>

<style>
	/* Adjustments for icon-only menu */
	.menu li > a {
		padding: 0.75rem; /* Adjust padding as needed */
		justify-content: center;
	}
	.menu li > a.active {
		background-color: hsl(var(--p));
		color: hsl(var(--pc));
	}
	.menu li > a:not(.active):hover {
		background-color: hsl(var(--b3)); /* Use base-300 for hover */
	}
</style>
