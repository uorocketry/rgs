import { LayoutConfig, type VirtualLayout } from 'golden-layout';
import type { ComponentType } from 'svelte';
import { writable, type Writable } from 'svelte/store';

// Components

export const layoutComponents: Record<string, () => Promise<ComponentType>> = {
	RocketNavBall: async () => {
		return (await import('$lib/components/smart/RocketNavBall.svelte')).default;
	},
	RocketTracker: async () => {
		return (await import('$lib/components/smart/RocketTracker.svelte')).default;
	},
	Map: async () => {
		return (await import('$lib/components/smart/Map.svelte')).default;
	},
	ErrorRate: async () => {
		return (await import('$lib/components/smart/graphs/ErrorRate.svelte')).default;
	},
	GenericSbgGraph: async () => {
		return (await import('$lib/components/smart/graphs/GenericSbgGraph.svelte')).default;
	},
	MissedMessage: async () => {
		return (await import('$lib/components/smart/graphs/MissedMessage.svelte')).default;
	},
	LayoutList: async () => {
		return (await import('$lib/components/smart/lists/LayoutList.svelte')).default;
	},
	RadioStatus: async () => {
		return (await import('$lib/components/smart/lists/RadioStatus.svelte')).default;
	},
	RocketMotion: async () => {
		return (await import('$lib/components/smart/lists/RocketMotion.svelte')).default;
	},
	RocketStatus: async () => {
		return (await import('$lib/components/smart/lists/RocketStatus.svelte')).default;
	}
};

export const layoutComponentsString = Object.keys(layoutComponents);
export const virtualLayout: Writable<VirtualLayout | undefined> = writable();
export const layoutConfig: Writable<LayoutConfig> = writable({
	settings: {
		showPopoutIcon: false
	},
	dimensions: {
		headerHeight: 32
	},
	root: {
		type: 'row',
		content: [
			{
				type: 'component',
				title: 'Layouts',
				componentType: 'LayoutList'
			}
		]
	}
});

export function startLayout() {
	const layoutConfigStr = localStorage.getItem('layoutConfig');
	if (layoutConfigStr) {
		try {
			console.info('Loading layoutConfig from localStorage');
			const resolved = JSON.parse(layoutConfigStr);
			layoutConfig.set(LayoutConfig.fromResolved(resolved));
		} catch (error) {
			console.error(
				"Failed to parse layoutConfig from localStorage. It's probably corrupted.",
				error
			);
			localStorage.removeItem('layoutConfig');
		}
	}

	layoutConfig.subscribe((config) => {
		localStorage.setItem('layoutConfig', JSON.stringify(config));
		console.info('Saved layoutConfig to localStorage');
	});
}
