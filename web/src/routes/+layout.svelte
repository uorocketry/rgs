<script lang="ts">
	// CSS
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.css';

	import 'chart.js/auto'; // Import everything from chart.js
	// TODO: Don't do this, have it self contained

	import {
		AppBar,
		AppShell,
		Toast,
		setModeCurrent,
		setModeUserPrefers,
		storePopup
	} from '@skeletonlabs/skeleton';

	import { findSetting } from '$lib/common/settings';
	import MasterCommandBox from '$lib/components/Common/CommandBox/MasterCommandBox.svelte';
	import SideBar from '$lib/components/Common/SideBar.svelte';
	import { commandBoxToggle, gqlClient } from '$lib/stores';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { getToastStore, initializeStores } from '@skeletonlabs/skeleton';
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

		console.log = (...args: unknown[]) => {
			if ($consoleNotifications) {
				toastStore.trigger({
					background: 'variant-filled-primary',
					classes: 'text-sm',
					message: textWrapper(args.join(' '))
				});
			}
			oldConsoleLog(...args);
		};

		console.warn = (...args: unknown[]) => {
			if ($consoleNotifications) {
				toastStore.trigger({
					background: 'variant-filled-warning',
					message: textWrapper(args.join(' '))
				});
			}
			oldConsoleWarn(...args);
		};

		console.error = (...args: unknown[]) => {
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

	import { setContextClient } from '@urql/svelte';

	setContextClient(gqlClient);
</script>

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
