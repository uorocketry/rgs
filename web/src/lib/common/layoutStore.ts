import { LayoutConfig, type VirtualLayout } from 'golden-layout';
import { writable, type Writable } from 'svelte/store';

// Components

export const layoutComponents = {
	RocketNavBall: () => import('$lib/components/smart/RocketNavBall.svelte'),
	RocketTracker: () => import('$lib/components/smart/RocketTracker.svelte'),
	Map: () => import('$lib/components/smart/Map.svelte'),
	ErrorRate: () => import('$lib/components/smart/graphs/ErrorRate.svelte'),
	GenericSbgGraph: () => import('$lib/components/smart/graphs/GenericSbgGraph.svelte'),
	MissedMessage: () => import('$lib/components/smart/graphs/MissedMessage.svelte'),
	LayoutList: () => import('$lib/components/smart/lists/LayoutList.svelte'),
	RadioStatus: () => import('$lib/components/smart/lists/RadioStatus.svelte'),
	RocketMotion: () => import('$lib/components/smart/lists/RocketMotion.svelte'),
	RocketStatus: () => import('$lib/components/smart/lists/RocketStatus.svelte')
} satisfies Record<string, () => Promise<{ default: any }>>;

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
