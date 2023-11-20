import { pb } from '$lib/stores';
import type { ResolvedLayoutConfig } from 'golden-layout';
import { get, writable, type Writable } from 'svelte/store';
import { flightDirector } from '../realtime/flightDirector';
import { layoutComponentsString, resolvedLayout, virtualLayout } from './dashboard';
import {
	Collections,
	type FlightDirectorRecord,
	type LayoutsRecord,
	type LayoutsResponse
} from './pocketbase-types';

export interface CommandAction {
	name: string;
	do: () => void;
}

export interface CommandRequest {
	string: (prompt: string, placeholder?: string) => Promise<string | undefined>;
	select: (prompt: string, options: string[], placeholder?: string) => Promise<number | undefined>;
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
			const saved = get(resolvedLayout);
			if (!saved) return;
			pb.collection(Collections.Layouts).create({
				name: layoutName,
				data: saved
			} satisfies LayoutsRecord);
		}
	},
	{
		name: 'Layout: Load Layout',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			// Load layouts from server
			const layouts = await pb
				.collection('layouts')
				.getFullList<LayoutsResponse<ResolvedLayoutConfig>>();
			const layoutNames = layouts.map((l) => l.name);

			const layoutIndex = await cmd.select('Layout name?', layoutNames, 'Recovery Layout');
			if (layoutIndex === undefined) return;
			const layout = layouts[layoutIndex];
			if (layout.data) {
				resolvedLayout.set(layout.data);
			} else {
				console.error('Failed to load layout: ' + layout.name);
			}
		}
	},
	{
		name: 'Layout: Add Component',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;
			const toAdd = await cmd.select('Component to add?', layoutComponentsString, 'ComponentName');
			if (toAdd === undefined) return;
			const vLayout = get(virtualLayout);
			if (!vLayout) return;
			vLayout.addComponent(layoutComponentsString[toAdd], undefined, layoutComponentsString[toAdd]);
		}
	},
	{
		name: 'Close command palette',
		do: () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;
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
			const prevFD = get(flightDirector);
			pb.collection(Collections.FlightDirector).create({
				latitude: lat,
				longitude: lng,
				targetAltitude: prevFD?.targetAltitude,
				relativeAltitude: prevFD?.relativeAltitude
			} satisfies FlightDirectorRecord);
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
			const prevFD = get(flightDirector);
			pb.collection(Collections.FlightDirector).create({
				latitude: prevFD?.latitude,
				longitude: prevFD?.longitude,
				targetAltitude: targetAltNum,
				relativeAltitude: prevFD?.relativeAltitude
			} satisfies FlightDirectorRecord);
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
			const prevFD = get(flightDirector);
			pb.collection(Collections.FlightDirector).create({
				latitude: prevFD?.latitude,
				longitude: prevFD?.longitude,
				targetAltitude: prevFD?.targetAltitude,
				relativeAltitude: targetAltNum
			} satisfies FlightDirectorRecord);
		}
	}
]);
