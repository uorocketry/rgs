import { LayoutConfig, type VirtualLayout } from 'golden-layout';
import { writable, type Writable } from 'svelte/store';

// Components
import SmartNavBall from '$lib/components/smart/SmartNavBall.svelte';
import GenericSbgGraph from '$lib/components/Panels/GenericSbgGraph.svelte';
import RadioStatus from '$lib/components/radio/RadioStatus.svelte';
import ErrorRate from '$lib/components/radio/ErrorRate.svelte';
import LayoutList from '$lib/components/LayoutList.svelte';
import MissedMessage from '$lib/components/radio/MissedMessage.svelte';
import Map from '$lib/components/Map.svelte';
import LogViewer from '$lib/components/LogViewer.svelte';
import Settings from '$lib/components/Settings.svelte';
import { browser } from '$app/environment';

export const layoutComponents = {
	SmartNavBall,
	Settings,
	Map,
	LogViewer,
	ErrorRate,
	MissedMessage,
	RadioStatus,
	GenericSbgGraph,
	LayoutList
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
			// {
			//   type: "component",
			//   title: "NavBall",
			//   componentType: "SmartNavBall",
			// },
			{
				type: 'component',
				title: 'Layouts',
				componentType: 'LayoutList'
			},
			{
				type: 'component',
				title: 'RadioStatus',
				componentType: 'RadioStatus'
			},
			{
				type: 'component',
				title: 'MissedMessages',
				componentType: 'MissedMessage'
			},
			{
				title: 'Height Chart',
				type: 'component',
				componentType: 'GenericSbgGraph',
				componentState: {
					selected: {
						sbg: ['height']
					}
				}
			},
			{
				type: 'component',
				title: 'ErrorRate',
				componentType: 'ErrorRate'
			}
		]
	}
});

if (browser) {
	const layoutConfigStr = localStorage.getItem('layoutConfig');
	if (layoutConfigStr) {
		try {
			console.info('Loading layoutConfig from localStorage');
			const resolved = JSON.parse(layoutConfigStr);
			layoutConfig.set(LayoutConfig.fromResolved(resolved));
		} catch (error) {
			console.error("Failed to parse layoutConfig from localStorage. It's probably corrupted.");
			localStorage.removeItem('layoutConfig');
		}
	}

	layoutConfig.subscribe((config) => {
		localStorage.setItem('layoutConfig', JSON.stringify(config));
		console.info('Saved layoutConfig to localStorage');
	});
}
