<script lang="ts">
	// CSS
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.css';
	import '../leaflet.css';

	import 'chart.js/auto'; // Import everything from chart.js
	import {
		AppBar,
		AppShell,
		Toast,
		setModeCurrent,
		setModeUserPrefers,
		storePopup
	} from '@skeletonlabs/skeleton';

	import { findSetting } from '$lib/common/settings';
	import SideBar from '$lib/components/smart/SideBar.svelte';
	import MasterCommandBox from '$lib/components/smart/commandPallete/MasterCommandBox.svelte';
	import { commandBoxToggle } from '$lib/stores';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { getToastStore, initializeStores, setInitialClassState } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	initializeStores();

	const sideBarLeft = findSetting('ui.sidebarLeft')?.value as Writable<boolean>;
	const useDarkMode = findSetting('ui.lightMode')?.value as Writable<boolean>;
	const toastStore = getToastStore();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const consoleNotifications = findSetting('notifications.consoleNotifications')
		?.value as Writable<boolean>;

	useDarkMode.subscribe((val) => {
		setModeUserPrefers(val);
		setModeCurrent(val);
	});

	onMount(() => {
		const oldConsoleLog = console.log;
		const oldConsoleWarn = console.warn;
		const oldConsoleError = console.error;

		const textWrapper = (message: string) => {
			return `<span class="text-sm">${message}</span>`;
		};

		console.log = (...args: any[]) => {
			if ($consoleNotifications) {
				toastStore.trigger({
					background: 'variant-filled-primary',
					classes: 'text-sm',
					message: textWrapper(args.join(' '))
				});
			}
			oldConsoleLog(...args);
		};

		console.warn = (...args: any[]) => {
			if ($consoleNotifications) {
				toastStore.trigger({
					background: 'variant-filled-warning',
					message: textWrapper(args.join(' '))
				});
			}
			oldConsoleWarn(...args);
		};

		console.error = (...args: any[]) => {
			if ($consoleNotifications) {
				toastStore.trigger({
					background: 'variant-filled-error',
					classes: 'text-sm',
					message: textWrapper(args.join(' '))
				});
			}
			oldConsoleError(...args);
		};
	});
</script>

<!-- theme mode classes -->
<svelte:head>{@html `<script>(${setInitialClassState.toString()})();</script>`}</svelte:head>

<!-- Main toast service -->
<Toast position="tr" width="max-w-xs" />

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
				<button
					on:click={() => commandBoxToggle.set({})}
					class="btn flex place-content-center btn-xs w-full max-w-sm"
				>
					<i class="fa-solid fa-magnifying-glass text-sm"></i>
					<small>&Tilde; (Tilde)</small>
				</button>
			</div>
		</AppBar>
	</svelte:fragment>
	<MasterCommandBox />
	<svelte:fragment slot="sidebarLeft">
		{#if $sideBarLeft}
			<SideBar />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="sidebarRight">
		{#if !$sideBarLeft}
			<SideBar />
		{/if}
	</svelte:fragment>

	<slot />
	<!-- footer -->
	<svelte:fragment slot="footer">
		<div class="max-h-5 h-5 bg-surface-100-800-token border-t border-surface-500">
			<!-- TODO -->
		</div>
	</svelte:fragment>
</AppShell>
