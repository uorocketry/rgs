<script lang="ts">
	import { page } from '$app/stores';
	// import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton'; // Removed Skeleton imports
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
	<li>
		<a
			href="/health"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/health'}
			data-tip="System Health"
			aria-label="System Health"
		>
			<i class="fas fa-heart text-xl"></i>
		</a>
	</li>
	<li>
		<a
			href="/comm"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/comm'}
			data-tip="Hydra Provider"
			aria-label="Hydra Provider"
		>
			<i class="fas fa-broadcast-tower text-xl"></i>
		</a>
	</li>
	<li>
		<a
			href="/mock"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/mock'}
			data-tip="Mock"
			aria-label="Mock"
		>
			<i class="fas fa-masks-theater text-xl"></i>
		</a>
	</li>
	<li>
		<a
			href="/sbg"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/sbg'}
			data-tip="SBG Sensors"
			aria-label="SBG Sensors"
		>
			<i class="fas fa-satellite text-xl"></i>
		</a>
	</li>
	<li>
		<a
			href="/pfd"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/pfd'}
			data-tip="PFD"
			aria-label="Primary Flight Display"
		>
			<i class="fas fa-plane text-xl"></i>
		</a>
	</li>

	<li>
		<a
			href="/navball"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/navball'}
			data-tip="Navball"
			aria-label="Navball"
		>
			<i class="fas fa-compass text-xl"></i>
		</a>
	</li>

	<!-- Bottom Section (formerly trail slot) -->
	<div class="flex-grow"></div>
	<!-- Spacer to push items down -->
	<li>
		<a href="/help" class="tooltip tooltip-right" data-tip="Help" aria-label="Help">
			<i class="fas fa-question text-xl"></i>
		</a>
	</li>
	<li>
		<a
			href="/utils"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname.startsWith('/utils')}
			data-tip="Utilities"
			aria-label="Utilities"
		>
			<i class="fas fa-tools text-xl"></i>
		</a>
	</li>
	<li>
		<a
			href="/settings"
			class="tooltip tooltip-right"
			class:active={$page.url.pathname === '/settings'}
			data-tip="Settings"
			aria-label="Settings"
		>
			<i class="fas fa-cog text-xl"></i>
		</a>
	</li>
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
