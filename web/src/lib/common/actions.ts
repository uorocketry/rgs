import { get, writable, type Writable } from 'svelte/store';
import { layoutComponentsString, layoutConfig, virtualLayout } from './layoutStore';
import { LayoutConfig } from 'golden-layout';
import { pb } from '$lib/stores';
import { launchPoint } from '../realtime/launchPoint';

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
	},
	{
		name: 'FlightPlan: Set Launch Point ',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			const launchPointStr = await cmd.string('Launch Point?', 'Latitude, Longitude');
			if (!launchPointStr) return;
			const launchPointSplit = launchPointStr.split(',');
			if (launchPointSplit.length !== 2) return;
			const lat = parseFloat(launchPointSplit[0]);
			const lng = parseFloat(launchPointSplit[1]);
			if (isNaN(lng) || isNaN(lat)) return;
			pb.collection('FlightDirector').create({
				latitude: lat,
				longitude: lng
			});

			// Update the store with the new values
			launchPoint.set({ lat, lng });
		}
	},
	{
		name: 'FlightPlan: Set Target Altitude',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			const targetAlt = await cmd.string('Target Altitude?', 'Target Altitude: 1000m');
			if (!targetAlt) return;
			const targetAltNum = parseFloat(targetAlt);
			if (isNaN(targetAltNum)) return;
			pb.collection('FlightDirector').create({
				targetAltitude: targetAltNum
			});
		}
	},
	{
		name: 'FlightPlan: Set Relative Altitude',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			const relativeAlt = await cmd.string('Relative Altitude?', 'Relative Altitude: 10m');
			if (!relativeAlt) return;
			const targetAltNum = parseFloat(relativeAlt);
			if (isNaN(targetAltNum)) return;
			pb.collection('FlightDirector').create({
				relativeAltitude: targetAltNum
			});
		}
	},

]);
