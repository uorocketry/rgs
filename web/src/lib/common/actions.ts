import { get, writable, type Writable } from 'svelte/store';
import { layoutComponentsString } from './dashboard';
import { browser } from '$app/environment';
import { dashboard_components } from './dashboard';
import { addWidgetToStore, type WidgetConfig } from '$lib/stores/widgetStore';
// import { graphql } from 'gql.tada';

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
		name: 'Layout: Add Component',
		do: async () => {
			const cmd = get(commandReqAdaptor);
			if (!cmd) return;

			// Ensure layoutComponentsString is up-to-date if needed
			// (Assuming layoutComponentsString from dashboard.ts is still relevant for selection)
			const componentNames = Object.keys(dashboard_components);

			const selectedIndex = await cmd.select('Component to add?', componentNames, 'ComponentName');
			if (selectedIndex === undefined) return;

			const componentName = componentNames[selectedIndex];

			// Create a configuration for the new widget
			const newWidgetConfig: WidgetConfig = {
				id: `${componentName}-${Date.now()}`, // Simple unique ID generation
				componentName: componentName,
				title: componentName, // Use name as title by default
				// options: {} // Add default layout options if desired
			};

			// Add the widget config to the store
			addWidgetToStore(newWidgetConfig);

			// Old Golden Layout code removed:
			// const vLayout = get(virtualLayout);
			// if (!vLayout) return;
			// vLayout.addComponent(layoutComponentsString[toAdd], undefined, layoutComponentsString[toAdd]);
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
			// const prevFD = get(flightDirector);
			// TODO: Reimplement me
			// pb.collection(Collections.FlightDirector).create({
			// 	latitude: lat,
			// 	longitude: lng,
			// 	targetAltitude: prevFD?.targetAltitude,
			// 	relativeAltitude: prevFD?.relativeAltitude
			// } satisfies FlightDirectorRecord);
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
			// TODO: Reimplement me
			// const prevFD = get(flightDirector);
			// pb.collection(Collections.FlightDirector).create({
			// 	latitude: prevFD?.latitude,
			// 	longitude: prevFD?.longitude,
			// 	targetAltitude: targetAltNum,
			// 	relativeAltitude: prevFD?.relativeAltitude
			// } satisfies FlightDirectorRecord);
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
			// TODO: Reimplement me
			// const prevFD = get(flightDirector);
			// pb.collection(Collections.FlightDirector).create({
			// 	latitude: prevFD?.latitude,
			// 	longitude: prevFD?.longitude,
			// 	targetAltitude: prevFD?.targetAltitude,
			// 	relativeAltitude: targetAltNum
			// } satisfies FlightDirectorRecord);
		}
	}
]);
