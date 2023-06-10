import type { LayoutConfig, VirtualLayout } from 'golden-layout';
import { writable, type Writable } from 'svelte/store';

// Components
import SmartNavBall from '$lib/components/smart/SmartNavBall.svelte';
import GenericSbgGraph from '$lib/components/Panels/GenericSbgGraph.svelte';
import RadioStatus from '$lib/components/radio/RadioStatus.svelte';
import ErrorRate from '$lib/components/radio/ErrorRate.svelte';
import LayoutList from '$lib/components/LayoutList.svelte';
import MissedMessage from '$lib/components/radio/MissedMessage.svelte';

export const layoutComponents = {
	SmartNavBall,
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
