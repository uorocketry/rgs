<script lang="ts">
	// CSS
	import '../app.css';

	// Required for chart rendering, consider optimizing imports if needed
	import 'chart.js/auto';

	import { findSetting } from '$lib/common/settings';
	import MasterCommandBox from '$lib/components/Common/CommandBox/MasterCommandBox.svelte';
	import SideBar from '$lib/components/Common/SideBar.svelte';
	import ToastContainer from '$lib/components/Common/ToastContainer.svelte';
	import { commandBoxToggle } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { toastStore } from '$lib/stores/toastStore';

	let { children } = $props();

	const sideBarLeft = findSetting('ui.sidebarLeft')?.value as Writable<boolean>;
	const consoleNotifications = findSetting('notifications.consoleNotifications')
		?.value as Writable<boolean>;

	// Override console methods for potential toast notifications
	$effect(() => {
		const oldConsoleLog = console.log;
		const oldConsoleWarn = console.warn;
		const oldConsoleError = console.error;

		console.log = (...args: unknown[]) => {
			const message = args.map((arg) => String(arg)).join(' ');
			if (get(consoleNotifications)) {
				// TODO: Implement toast notification for log using a DaisyUI compatible solution
				// console.info('Toast [Log]:', ...args); // Temporary placeholder
				toastStore.info(message);
			}
			oldConsoleLog(...args);
		};

		console.warn = (...args: unknown[]) => {
			const message = args.map((arg) => String(arg)).join(' ');
			if (get(consoleNotifications)) {
				// TODO: Implement toast notification for warn using a DaisyUI compatible solution
				// console.info('Toast [Warn]:', ...args); // Temporary placeholder
				toastStore.warning(message);
			}
			oldConsoleWarn(...args);
		};

		console.error = (...args: unknown[]) => {
			const message = args.map((arg) => String(arg)).join(' ');
			if (get(consoleNotifications)) {
				// TODO: Implement toast notification for error using a DaisyUI compatible solution
				// console.info('Toast [Error]:', ...args); // Temporary placeholder
				toastStore.error(message, 0); // Keep errors until dismissed
			}
			oldConsoleError(...args);
		};

		// Cleanup function to restore original console methods
		return () => {
			console.log = oldConsoleLog;
			console.warn = oldConsoleWarn;
			console.error = oldConsoleError;
		};
	});

	// Theme Management
	const themeSetting = findSetting('ui.theme');
	let themeStore: Writable<string> | undefined;
	if (themeSetting && themeSetting.valueDescription === 'enum') {
		themeStore = themeSetting.value;
	}

	let currentTheme = $state(themeStore ? get(themeStore) : 'system');

	// Update state when theme store changes
	if (themeStore) {
		$effect(() => {
			return themeStore?.subscribe((value) => {
				currentTheme = value;
			});
		});
	}

	// Apply theme to document root
	$effect.pre(() => {
		if (!browser) return; // Ensure this runs only in the browser

		const htmlElement = document.documentElement;
		if (currentTheme === 'system') {
			htmlElement.removeAttribute('data-theme');
		} else {
			htmlElement.setAttribute('data-theme', currentTheme);
		}
	});
</script>

<ToastContainer />

<!-- DaisyUI Drawer Layout -->
<div class="drawer lg:drawer-open" class:drawer-end={$sideBarLeft}>
	<input id="sidebar-drawer" type="checkbox" class="drawer-toggle" />

	<!-- Page Content -->
	<div class="drawer-content flex flex-col h-screen overflow-hidden">
		<!-- Navbar -->
		<div class="navbar bg-base-100 border-b border-base-300 h-12 min-h-12">
			<div class="navbar-start">
				<img src="/favicon-32x32.png" class="w-8 h-8 p-1 ml-2" alt="logo" />
			</div>
			<div class="navbar-center">
				<button
					onclick={() => commandBoxToggle.set({})}
					class="btn btn-sm w-full max-w-sm flex items-center justify-center"
				>
					<i class="fa-solid fa-magnifying-glass text-sm mr-2"></i>
					<small>&Tilde; (Tilde)</small>
				</button>
			</div>
			<div class="navbar-end">
				<!-- Navbar end content (e.g., theme toggle, user menu) -->
			</div>
		</div>

		<!-- Command Box (Modal) -->
		<MasterCommandBox />

		<!-- Main Content Area -->
		<main class="flex-1 overflow-y-auto bg-base-100">
			{@render children?.()}
		</main>

		<!-- Footer / Status Bar -->
		<footer class="footer footer-center items-center p-1 bg-base-300 text-base-content h-5 min-h-5">
			<aside>
				<p class="text-xs">Status bar content goes here</p>
			</aside>
		</footer>
	</div>

	<!-- Sidebar Content -->
	<div class="drawer-side border-r border-base-300" style="scroll-behavior: smooth;">
		<SideBar />
	</div>
</div>
