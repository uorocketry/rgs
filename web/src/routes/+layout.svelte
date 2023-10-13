<script lang="ts">
	// CSS
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.css';
	import '../leaflet.css';

	import 'chart.js/auto'; // Import everything from chart.js
	import { startLayout } from '$lib/common/layoutStore';
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';

	import SideBar from '$lib/components/smart/SideBar.svelte';
	import MasterCommandBox from '$lib/components/smart/commandPallete/MasterCommandBox.svelte';
	import { onMount } from 'svelte';
	onMount(() => {
		startLayout();
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar
			padding="p-0"
			background="bg-surface-100-800-token"
			border="border-b border-surface-500"
		>
			<svelte:fragment slot="lead">
				<img src="/favicon-32x32.png" class="ml-1 w-8 h-8 p-1" alt="logo" />
			</svelte:fragment>
			<div class="flex place-content-center max-h-8">
				<button class="btn flex place-content-center btn-xs w-full max-w-sm variant-glass">
					<i class="fa-solid fa-magnifying-glass text-sm"></i>
					<small>&Tilde; (Tilde)</small>
				</button>
			</div>
			<svelte:fragment slot="trail">
				<div class="mr-1">
					<LightSwitch />
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<MasterCommandBox />
		<SideBar />
	</svelte:fragment>
	<slot />
	<!-- footer -->
	<svelte:fragment slot="footer">
		<div class="max-h-5 h-5 bg-surface-100-800-token border-t border-surface-500">
			<!-- TODO -->
		</div>
	</svelte:fragment>
</AppShell>
