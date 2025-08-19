<script lang="ts">
	// CSS
	import '../app.css';

	import { browser } from '$app/environment';
	import { findSetting } from '$lib/common/settings';
	import MasterCommandBox from '$lib/components/Common/CommandBox/MasterCommandBox.svelte';
	import ToastContainer from '$lib/components/Common/ToastContainer.svelte';
	import GridBackground from '$lib/components/Common/GridBackground.svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { isImmersiveMode } from '$lib/stores/uiStore';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Carbon Components
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		Content,
		Theme,
		breakpointObserver
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
	import '@carbon/charts/styles.css';

	let { children } = $props();

	// control SideNav (Svelte 5 runes)
	let sideOpen = $state(false);

	// Use Carbon's breakpoint observer for responsive behavior

	import { readable } from 'svelte/store';
	const breakpoint = browser ? breakpointObserver() : { smallerThan: () => readable(false) };
	const isMobile = breakpoint.smallerThan('lg'); // lg = 1056px

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

	// Theme Management via centralized store
	import { carbonTheme } from '$lib/common/theme';
	let currentTheme = $state<'white' | 'g10' | 'g80' | 'g90' | 'g100'>('g100');
	$effect(() => carbonTheme.subscribe((t) => (currentTheme = t)));

	type TabItem = {
		href: string;
		tip: string;
		icon: string; // FontAwesome class
	};

	type MenuGroup = {
		title: string;
		icon: string;
		items: TabItem[];
	};

	const MENU_GROUPS: MenuGroup[] = [
		{
			title: 'Flight',
			icon: 'fas fa-rocket',
			items: [
				{ href: '/state', tip: 'State', icon: 'fas fa-flag-checkered' },
				{ href: '/altitude', tip: 'Altitude', icon: 'fas fa-mountain' },
				{ href: '/imu', tip: 'IMU', icon: 'fas fa-microchip' },
				{ href: '/trajectory', tip: 'Trajectory', icon: 'fas fa-route' },
				{ href: '/navball', tip: 'Navball', icon: 'fas fa-compass' }
			]
		},
		{
			title: 'Sensors',
			icon: 'fas fa-satellite',
			items: [
				{ href: '/sbg', tip: 'SBG', icon: 'fas fa-satellite' },
				{ href: '/radio', tip: 'Radio', icon: 'fas fa-signal' }
			]
		},
		{
			title: 'Control',
			icon: 'fas fa-terminal',
			items: [
				{ href: '/commands', tip: 'Commands', icon: 'fas fa-terminal' },
				{ href: '/services', tip: 'Services', icon: 'fas fa-server' }
			]
		},
		{
			title: 'Tools',
			icon: 'fas fa-tools',
			items: [
				{ href: '/mock', tip: 'Mock Data', icon: 'fas fa-masks-theater' },
				{ href: '/map-downloader', tip: 'Maps', icon: 'fas fa-map' },
				{ href: '/debug/coord-mock', tip: 'Mock Coordinates', icon: 'fas fa-crosshairs' }
			]
		}
	];

	const STANDALONE_TABS: TabItem[] = [{ href: '/settings', tip: 'Settings', icon: 'fas fa-cog' }];

	// Flatten all tabs for gamepad navigation
	const TABS: TabItem[] = [...MENU_GROUPS.flatMap((group) => group.items), ...STANDALONE_TABS];

	let lastL1 = false;
	let lastR1 = false;
	let l1HoldTime = 0;
	let r1HoldTime = 0;
	const initialDelay = 400; // ms before repeat starts
	const repeatInterval = 100; // ms between repeats

	function pollGamepads() {
		const now = Date.now();
		const gamepads = navigator.getGamepads?.().filter((gp) => gp !== null) as Gamepad[];
		for (const gp of gamepads) {
			if (!gp) continue;
			const l1 = gp.buttons[4]?.pressed;
			const r1 = gp.buttons[5]?.pressed;

			// L1 logic
			if (l1) {
				if (!lastL1) {
					navigateTab(-1);
					l1HoldTime = now;
				} else if (
					now - l1HoldTime > initialDelay &&
					(now - l1HoldTime - initialDelay) % repeatInterval < 16
				) {
					navigateTab(-1);
				}
			}
			lastL1 = l1;

			// R1 logic
			if (r1) {
				if (!lastR1) {
					navigateTab(1);
					r1HoldTime = now;
				} else if (
					now - r1HoldTime > initialDelay &&
					(now - r1HoldTime - initialDelay) % repeatInterval < 16
				) {
					navigateTab(1);
				}
			}
			lastR1 = r1;
		}
		requestAnimationFrame(pollGamepads);
	}

	onMount(() => {
		window.addEventListener('gamepadconnected', (e) => {
			toastStore.info(
				`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}. ${e.gamepad.buttons.length} buttons, ${e.gamepad.axes.length} axes.`
			);
		});

		window.addEventListener('gamepaddisconnected', (e) => {
			toastStore.info(`Gamepad disconnected at index ${e.gamepad.index}: ${e.gamepad.id}.`);
		});

		toastStore.info('Gamepads: ' + JSON.stringify(navigator.getGamepads?.()));

		if (browser) requestAnimationFrame(pollGamepads);

		return () => {};
	});

	function navigateTab(direction: number) {
		const currentIdx = TABS.findIndex(
			(tab) =>
				$page.url.pathname === tab.href ||
				(tab.href === '/utils' && $page.url.pathname.startsWith('/utils'))
		);
		if (currentIdx === -1) return;
		let nextIdx = (currentIdx + direction + TABS.length) % TABS.length;
		goto(TABS[nextIdx].href);
	}
</script>

<Theme theme={currentTheme}>
	<ToastContainer />

	<!-- Carbon Layout -->
	{#if !$isImmersiveMode}
		<Header company="UORocketry" platformName="Ground Station" bind:isSideNavOpen={sideOpen}>
			<HeaderNav>
				{#each MENU_GROUPS as group}
					<HeaderNavMenu text={group.title}>
						{#each group.items as item}
							<HeaderNavItem
								href={item.href}
								text={item.tip}
								isSelected={$page.url.pathname === item.href ||
									($page.url.pathname.startsWith(item.href + '/') && item.href !== '/')}
							/>
						{/each}
					</HeaderNavMenu>
				{/each}

				{#each STANDALONE_TABS as tab}
					<HeaderNavItem
						href={tab.href}
						text={tab.tip}
						isSelected={$page.url.pathname === tab.href}
					/>
				{/each}
			</HeaderNav>
		</Header>
		<!-- This is what the hamburger toggles on small screens - only show on mobile -->
		{#if $isMobile}
			<SideNav isOpen={sideOpen} fixed={false} on:close={() => (sideOpen = false)}>
				<SideNavItems>
					{#each MENU_GROUPS as group}
						<SideNavMenu text={group.title}>
							{#each group.items as item}
								<SideNavMenuItem
									href={item.href}
									isSelected={$page.url.pathname === item.href ||
										($page.url.pathname.startsWith(item.href + '/') && item.href !== '/')}
									on:click={() => {
										if ($isMobile) sideOpen = false;
									}}
								>
									{item.tip}
								</SideNavMenuItem>
							{/each}
						</SideNavMenu>
					{/each}

					{#each STANDALONE_TABS as tab}
						<SideNavLink
							href={tab.href}
							isSelected={$page.url.pathname === tab.href}
							on:click={() => {
								if ($isMobile) sideOpen = false;
							}}
						>
							{tab.tip}
						</SideNavLink>
					{/each}
				</SideNavItems>
			</SideNav>
		{/if}

		<!-- Command Box (Modal) -->
		<!-- <MasterCommandBox /> -->

		<!-- Main Content -->
		<Content>
			{@render children?.()}
		</Content>
		<GridBackground />
	{/if}
</Theme>
