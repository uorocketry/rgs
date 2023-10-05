import { LayoutConfig, type VirtualLayout } from 'golden-layout';
import { writable, type Writable } from 'svelte/store';

// Components
import Map from '$lib/components/smart/Map.svelte';
import SmartNavBall from '$lib/components/smart/RocketNavBall.svelte';
import RocketTracker from '$lib/components/smart/RocketTracker.svelte';
import ErrorRate from '$lib/components/smart/graphs/ErrorRate.svelte';
import GenericSbgGraph from '$lib/components/smart/graphs/GenericSbgGraph.svelte';
import MissedMessage from '$lib/components/smart/graphs/MissedMessage.svelte';
import LayoutList from '$lib/components/smart/lists/LayoutList.svelte';
import RadioStatus from '$lib/components/smart/lists/RadioStatus.svelte';
import RocketMotion from '$lib/components/smart/lists/RocketMotion.svelte';
import RocketStatus from '$lib/components/smart/lists/RocketStatus.svelte';

export const layoutComponents = {
	SmartNavBall,
	RocketTracker,
	Map,
	ErrorRate,
	MissedMessage,
	RadioStatus,
	GenericSbgGraph,
	LayoutList,
	RocketStatus,
	RocketMotion
} as const;

export const layoutComponentsString = Object.keys(layoutComponents);

export const virtualLayout: Writable<VirtualLayout | undefined> = writable();
export const layoutConfig: Writable<LayoutConfig> = writable({
	settings: {
		showPopoutIcon: false
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
