// Components
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { ResolvedLayoutConfig, VirtualLayout } from 'golden-layout';
import type { ComponentType } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const dashboard_components: Record<string, () => Promise<ComponentType>> = {
	RocketNavBall: async () => {
		return (await import('$lib/components/Dashboard/RocketNavBall/RocketNavBall.svelte')).default;
	},
	Map: async () => {
		return (await import('$lib/components/Dashboard/Map/Map.svelte')).default;
	},
	// ErrorRate: async () => {
	// 	return (await import('$lib/components/legacy/ErrorRate/ErrorRate.svelte')).default;
	// },
	// GenericSbgGraph: async () => {
	// 	return (await import('$lib/components/smart/graphs/GenericSbgGraph.svelte')).default;
	// },
	// MissedMessage: async () => {
	// 	return (await import('$lib/components/smart/graphs/MissedMessage.svelte')).default;
	// },
	LayoutList: async () => {
		return (await import('$lib/components/Dashboard/LayoutList/LayoutList.svelte')).default;
	},
	RadioStatus: async () => {
		return (await import('$lib/components/Dashboard/RadioStatus/RadioStatus.svelte')).default;
	},
	RocketMotion: async () => {
		return (await import('$lib/components/Dashboard/RocketMotion/RocketMotion.svelte')).default;
	},
	RocketStatus: async () => {
		return (await import('$lib/components/Dashboard/RocketStatus/RocketStatus.svelte')).default;
	},
	Pressure: async () => {
		return (await import('$lib/components/Dashboard/Pressure/Pressure.svelte')).default;
	},
	Altitude: async () => {
		return (await import('$lib/components/Dashboard/Altitude/Altitude.svelte')).default;
	},
	IMUTemp: async () => {
		return (await import('$lib/components/Dashboard/IMUTemp/IMUTemp.svelte')).default;
	},
	Acceleration: async () => {
		return (await import('$lib/components/Dashboard/Acceleration/Acceleration.svelte')).default;
	},
	VerticalVelocity: async () => {
		return (await import('$lib/components/Dashboard/VerticalVelocity/VerticalVelocity.svelte')).default;
	}
	// LogViewer: async () => {
	// 	return (await import('$lib/components/smart/LogViewer.svelte')).default;
	// }
};

export const layoutComponentsString = Object.keys(dashboard_components);

export const virtualLayout: Writable<VirtualLayout | undefined> = writable(undefined);
export const resolvedLayout: Writable<
	(ResolvedLayoutConfig & { ignoreReload?: boolean }) | undefined
> = localStorageStore('resolvedLayout', undefined);
