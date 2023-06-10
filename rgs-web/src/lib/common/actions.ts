import { get, writable, type Writable } from 'svelte/store';
import { layoutComponentsString, layoutConfig, virtualLayout } from './layoutStore';
import { LayoutConfig } from 'golden-layout';
import { pb } from '$lib/stores';

export interface CommandAction {
	name: string;
	do: () => void;
}

export interface CommandRequest {
	string: (prompt: string, placeholder: string) => Promise<string | undefined>;
	select: (prompt: string, options: string[]) => Promise<number | undefined>;
}

const defaultAdapterResponse = async () => {
	console.log('No command request adaptor set');
	return undefined;
};
export let commandReqAdaptor: Writable<CommandRequest> = writable({
	string: defaultAdapterResponse,
	select: defaultAdapterResponse
});

export let commandActions: Writable<CommandAction[]> = writable([
	{
		name: 'Developer: Alert Test',
		do: async () => {
			let cmd = get(commandReqAdaptor);
			if (!cmd) return;

			let alertMsg = await cmd.string('Alert Message?', 'Hello World');
			console.log('Alert Test: ' + alertMsg);
			alert(alertMsg);
		}
	},
	// Layout Actions
	{
		name: 'Layout: Save Layout',
		do: async () => {
			let cmd = get(commandReqAdaptor);
			if (!cmd) return;

			let layoutName = await cmd.string('Layout name?', 'Recovery Layout');
			if (!layoutName) return;
			console.log('Saving layout: ' + layoutName);
			let vLayout = get(virtualLayout);
			if (!vLayout) return;
			let saved = vLayout.saveLayout();
			pb.collection('layouts').create({
				name: layoutName,
				data: JSON.stringify(saved)
			});
		}
	},
	{
		name: 'Layout: Load Layout',
		do: async () => {
			let cmd = get(commandReqAdaptor);
			if (!cmd) return;

			// Load layouts from server
			let layouts = await pb.collection('layouts').getFullList();
			let layoutNames = layouts.map((l) => l.name);

			let layoutIndex = await cmd.select('Layout name?', layoutNames);
			if (layoutIndex === undefined) return;
			let layout = layouts[layoutIndex];
			layoutConfig.set(LayoutConfig.fromResolved(layout.data));
		}
	},
	{
		name: 'Layout: Add Component',
		do: async () => {
			let cmd = get(commandReqAdaptor);
			if (!cmd) return;

			let toAdd = await cmd.select('Component to add?', layoutComponentsString);
			if (toAdd === undefined) return;
			let vLayout = get(virtualLayout);
			if (!vLayout) return;
			vLayout.addComponent(layoutComponentsString[toAdd], undefined, layoutComponentsString[toAdd]);
		}
	},
	{
		name: 'Developer: Bar',
		do: () => {
			console.log('Alert Test');
		}
	}
]);
