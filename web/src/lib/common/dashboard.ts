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
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { ResolvedLayoutConfig, VirtualLayout } from 'golden-layout';
import { writable, type Writable } from 'svelte/store';

export const dashboard_components = {
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

export const layoutComponentsString = Object.keys(dashboard_components);

export const virtualLayout: Writable<VirtualLayout | undefined> = writable(undefined);
export const resolvedLayout: Writable<
	(ResolvedLayoutConfig & { ignoreReload?: boolean }) | undefined
> = localStorageStore('resolvedLayout', undefined);
