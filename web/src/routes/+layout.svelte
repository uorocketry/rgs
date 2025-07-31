<script lang="ts">
	// CSS
	import '../app.css';

	// Required for chart rendering, consider optimizing imports if needed
	import 'chart.js/auto';

	import { browser } from '$app/environment';
	import { findSetting } from '$lib/common/settings';
	import MasterCommandBox from '$lib/components/Common/CommandBox/MasterCommandBox.svelte';
	import ToastContainer from '$lib/components/Common/ToastContainer.svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { isImmersiveMode } from '$lib/stores/uiStore';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const sideBarLeft = findSetting('ui.sidebarLeft')?.value as Writable<boolean>;
	const consoleNotifications = findSetting('notifications.consoleNotifications')
		?.value as Writable<boolean>;

	// --- Immersive Mode Hotkey ---
	onMount(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				event.preventDefault(); // Prevent default Tab behavior (focus change)
				isImmersiveMode.update((n) => !n);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

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
		{ href: '/utils', tip: 'Utilities', icon: 'fas fa-tools' },
		{ href: '/settings', tip: 'Settings', icon: 'fas fa-cog' },
	];

	let lastL1 = false;
	let lastR1 = false;
	let l1HoldTime = 0;
	let r1HoldTime = 0;
	const initialDelay = 400; // ms before repeat starts
	const repeatInterval = 100; // ms between repeats

	function pollGamepads() {
		const now = Date.now();
		const gamepads = navigator.getGamepads?.().filter(gp => gp !== null) as Gamepad[];
		for (const gp of gamepads) {
			if (!gp) continue;
			const l1 = gp.buttons[4]?.pressed;
			const r1 = gp.buttons[5]?.pressed;

			// L1 logic
			if (l1) {
				if (!lastL1) {
					navigateTab(-1);
					l1HoldTime = now;
				} else if (now - l1HoldTime > initialDelay && (now - l1HoldTime - initialDelay) % repeatInterval < 16) {
					navigateTab(-1);
				}
			}
			lastL1 = l1;

			// R1 logic
			if (r1) {
				if (!lastR1) {
					navigateTab(1);
					r1HoldTime = now;
				} else if (now - r1HoldTime > initialDelay && (now - r1HoldTime - initialDelay) % repeatInterval < 16) {
					navigateTab(1);
				}
			}
			lastR1 = r1;
		}
		requestAnimationFrame(pollGamepads);
	}

	onMount(() => {
		window.addEventListener("gamepadconnected", (e) => {
			toastStore.info(`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}. ${e.gamepad.buttons.length} buttons, ${e.gamepad.axes.length} axes.`);
		});

		window.addEventListener("gamepaddisconnected", (e) => {
			toastStore.info(`Gamepad disconnected at index ${e.gamepad.index}: ${e.gamepad.id}.`);
		});

		toastStore.info('Gamepads: ' + JSON.stringify(navigator.getGamepads?.()));

		if (browser) requestAnimationFrame(pollGamepads);

		return () => {};
	});

	function navigateTab(direction: number) {
		const currentIdx = TABS.findIndex(tab =>
			$page.url.pathname === tab.href ||
			(tab.href === '/utils' && $page.url.pathname.startsWith('/utils'))
		);
		if (currentIdx === -1) return;
		let nextIdx = (currentIdx + direction + TABS.length) % TABS.length;
		goto(TABS[nextIdx].href);
	}
</script>


<ToastContainer />

<!-- DaisyUI Drawer Layout -->

	<!-- Page Content -->
<div class="flex flex-col h-screen overflow-clip">
	<!-- Navbar -->
	{#if !$isImmersiveMode}
		<div class="navbar bg-black h-15 min-h-15 p-0">
			<div class="navbar-start">
				<a href="/">
					<img src="/favicon-32x32.png" class="w-8 h-8 p-1 ml-2" alt="logo" />
				</a>
			</div>
			<!-- Navbar Center -->
			<div class="inline-flex items-center flex-shrink-0">
				<!-- Navigation tabs here!! -->
				 <nav class="flex">
				{#each TABS as tab}
					<a
						href={tab.href}
						class="tooltip  tooltip-bottom h-15 w-15 grid place-items-center"
						class:text-white={$page.url.pathname !== tab.href}
						class:bg-white={$page.url.pathname === tab.href}
						class:text-black={$page.url.pathname === tab.href}
						data-tip={tab.tip}
						aria-label={tab.tip}
					>
						<i class={`${tab.icon} text-xl`}></i>
					</a>
					{/each}
				</nav>
			</div>
			<div class="navbar-end">
				<!-- Navbar end content (e.g., theme toggle, user menu) -->
			</div>
		</div>
	{/if}

	<!-- Command Box (Modal) -->
	<MasterCommandBox />

	<!-- Main Content Area -->
	<main
		class="flex-1 overflow-y-auto "
		class:h-screen={!$isImmersiveMode}
		class:!h-full={$isImmersiveMode}
		class:pt-0={$isImmersiveMode}
		class:pb-0={$isImmersiveMode}
	>
		{@render children?.()}
	</main>

	<!-- Footer / Status Bar -->
	{#if !$isImmersiveMode}
		<footer
			class="footer footer-center items-center p-1 bg-black text-base-content h-15 min-h-15"
		>
			<aside>
				<p class="text-xs">Status bar content goes here</p>
			</aside>
		</footer>
	{/if}
</div>
<div class="grid-background"></div>

<style>
.grid-background {
    position: fixed;
	z-index: -1;
	pointer-events: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        repeating-linear-gradient(0deg, rgba(117,117,117,0.12) 0, rgba(117,117,117,0.12) 1px, transparent 1px, transparent 50px),
        repeating-linear-gradient(90deg, rgba(117,117,117,0.12) 0, rgba(117,117,117,0.12) 1px, transparent 1px, transparent 50px);
    background-size: 50px 50px, 50px 50px, 200px 200px;
    background-position: 0 0, 0 0, 0 0;
    animation: gridMove 15s linear infinite, gridGlow 10s linear infinite;
}


@keyframes gridMove {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 200px 200px;
    }
}

@keyframes gridGlow {
    0%, 100% {
        filter: brightness(1);
    }
    50% {
        filter: brightness(1.2) drop-shadow(0 0 4px #fff8);
    }
}

@keyframes crossMove {
    0% {
        background-position: 25px 25px;
    }
    100% {
        background-position: 225px 225px;
    }
}

.navbar-center .active {
	background-color: hsl(var(--p));
	color: hsl(var(--pc));
}
.navbar-center a:not(.active):hover {
	background-color: hsl(var(--b3));
}
</style>