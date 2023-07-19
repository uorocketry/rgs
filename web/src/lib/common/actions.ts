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
export const commandReqAdaptor: Writable<CommandRequest> = writable({
	string: defaultAdapterResponse,
	select: defaultAdapterResponse
});

export const commandActions: Writable<CommandAction[]> = writable([
	// {
	// 	name: 'Developer: Alert Test',
	// 	do: async () => {
	// 		const cmd = get(commandReqAdaptor);
	// 		if (!cmd) return;

	// 		const alertMsg = await cmd.string('Alert Message?', 'Hello World');
	// 		console.log('Alert Test: ' + alertMsg);
	// 		alert(alertMsg);
	// 	}
	// },
	// Layout Actions
	{
		name: 'Layout: Save Layout',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			const layoutName = await cmd.string('Layout name?', 'Recovery Layout');
			if (!layoutName) return;
			console.log('Saving layout: ' + layoutName);
			const vLayout = get(virtualLayout);
			if (!vLayout) return;
			const saved = vLayout.saveLayout();
			pb.collection('layouts').create({
				name: layoutName,
				data: JSON.stringify(saved)
			});
		}
	},
	{
		name: 'Layout: Load Layout',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			// Load layouts from server
			const layouts = await pb.collection('layouts').getFullList();
			const layoutNames = layouts.map((l) => l.name);

			const layoutIndex = await cmd.select('Layout name?', layoutNames);
			if (layoutIndex === undefined) return;
			const layout = layouts[layoutIndex];
			layoutConfig.set(LayoutConfig.fromResolved(layout.data));
		}
	},
	{
		name: 'Layout: Add Component',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			const toAdd = await cmd.select('Component to add?', layoutComponentsString);
			if (toAdd === undefined) return;
			const vLayout = get(virtualLayout);
			if (!vLayout) return;
			vLayout.addComponent(layoutComponentsString[toAdd], undefined, layoutComponentsString[toAdd]);
		}
	}
]);
