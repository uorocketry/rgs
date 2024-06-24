<script lang="ts">
	// CSS
	import svgDatabase from '$lib/assets/fa-database.svg?raw';
	import svgHeart from '$lib/assets/fa-heart.svg?raw';
	import svgLineChart from '$lib/assets/fa-line-chart.svg?raw';
	import svgMasksTheater from '$lib/assets/fa-masks-theatre.svg?raw';
	import svgTowerBroadcast from '$lib/assets/fa-tower-broadcast.svg?raw';

	import svgCog from '$lib/assets/fa-cog.svg?raw';
	import svgQuestion from '$lib/assets/fa-question.svg?raw';

	import '$lib/components/Common/nav-link';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import 'chart.js/auto';
	import '../app.css';
	import '../tw.css';
	// Import everything from chart.js
	// TODO: Don't do this, have it self contained

	import { setModeCurrent, setModeUserPrefers, storePopup } from '@skeletonlabs/skeleton';

	import { findSetting } from '$lib/common/settings';
	import MasterCommandBox from '$lib/components/Common/CommandBox/MasterCommandBox.svelte';
	import '$lib/components/Common/toast-man';
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

	import { page } from '$app/stores';
	import { lit } from '$lib/common/rendering';
	import { ToastManager } from '$lib/components/Common/toast-man';
	import { MAGNIFYING_GLASS } from '$lib/components/partials/svgs';
	import { setContextClient } from '@urql/svelte';

	setContextClient(gqlClient);

	const topSideLinks = [
		{
			name: 'Dashboard',
			icon: svgLineChart,
			url: '/dashboard'
		},
		{
			name: 'Health',
			icon: svgHeart,
			url: '/health'
		},
		{
			name: 'Communications',
			icon: svgTowerBroadcast,
			url: '/comm'
		},
		{
			name: 'Database',
			icon: svgDatabase,
			url: '/db'
		},
		{
			name: 'Mock',
			icon: svgMasksTheater,
			url: '/mock'
		}
	];

	const bottomSideLinks = [
		{
			name: 'Help',
			icon: svgQuestion,
			url: '/help'
		},
		{
			name: 'Settings',
			icon: svgCog,
			url: '/settings'
		}
	];
	let toastMan: ToastManager;

	onMount(() => {
		console.log('mounted');
		console.log(
			toastMan.pushToast({
				duration: 5000,
				message: 'Hello World',
				type: 'info'
			})
		);
	});
</script>

<rgs-toast-man bind:this={toastMan}></rgs-toast-man>
<MasterCommandBox />

<div class="h-full w-full flex flex-col overflow-hidden">
	<header class="flex items-center -outline-offset-4">
		<rgs-nav-link href="/" icon={svgLineChart} name="RGS">
			<img src="/logo.svg" alt="logo" />
		</rgs-nav-link>
		<div class="flex flex-1 place-content-center max-h-8">
			<button
				on:click={() => commandBoxToggle.set({})}
				class="flex gap-4 items-center justify-center w-full max-w-sm transition-all hover:shadow"
			>
				<div class="w-4 h-4" use:lit={MAGNIFYING_GLASS}></div>
				<small>&Tilde; (Tilde)</small>
			</button>
		</div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 8 8"
			stroke="currentColor"
		>
			<circle cx="4" cy="4" r="3" fill="rgb(var(--color-success-500) )" />
		</svg>
	</header>

	<div class="flex-1 flex">
		<aside class="h-full z-10">
			<nav class="flex flex-col h-full">
				{#each topSideLinks as sideLink}
					<!-- fill: var(--color-on-base); -->
					<rgs-nav-link
						href={sideLink.url}
						icon={sideLink.icon}
						name={sideLink.name}
						style=" {$page.url.pathname === sideLink.url
							? '--color-on-base: var(--color-info)'
							: ''}"
					>
						{@html sideLink.icon}
					</rgs-nav-link>
				{/each}
				<span class="flex-1"></span>
				{#each bottomSideLinks as sideLink}
					<rgs-nav-link
						href={sideLink.url}
						icon={sideLink.icon}
						name={sideLink.name}
						style=" {$page.url.pathname === sideLink.url
							? '--color-on-base: var(--color-info)'
							: ''}"
					>
						{@html sideLink.icon}
					</rgs-nav-link>
				{/each}
			</nav>
		</aside>
		<slot />
	</div>
</div>

<!-- footer -->
<!-- <svelte:fragment slot="footer">
	<div class="max-h-5 h-5 bg-surface-100-800-token border-t border-surface-500"> -->
<!-- TODO -->
<!-- </div>
</svelte:fragment> -->

<style>
	rgs-nav-link::part(base) {
		width: 2rem;
		height: 2rem;
	}

	header {
		outline: var(--color-on-base) solid 1px;
		outline-offset: -1px;
	}

	nav {
		outline: var(--color-on-base) solid 1px;
		outline-offset: -1px;
	}

	/* nav link with data-tooltip */
	/* nav a[data-tooltip] {
		position: relative;
		transition: all;
	}

	nav a[data-tooltip]:hover::before {
		transform: scaleX(1);
	}

	nav a[data-tooltip]::before {
		content: attr(data-tooltip);
		position: absolute;
		background: rgb(var(--color-surface-900));
		color: rgb(var(--on-surface));
		left: 100%;
		height: 100%;
		place-content: center;
		padding: 0rem 0.5rem;

		pointer-events: none;
		transition: all;
		transform-origin: left;
		transform: scaleX(0);
		transition: all 0.04s;
	} */
</style>
