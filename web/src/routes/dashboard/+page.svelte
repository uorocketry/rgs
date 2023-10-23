<script lang="ts">
	import { dashboard_components, resolvedLayout, virtualLayout } from '$lib/common/dashboard';
	import Lazy from '$lib/components/smart/Lazy.svelte';
	import {
		LayoutConfig,
		ResolvedLayoutConfig,
		type JsonValue,
		type VirtualLayout
	} from 'golden-layout';
	import { onMount } from 'svelte';
	import GoldenLayout from 'svelte-golden-layout';
	import { get, writable, type Writable } from 'svelte/store';
	import '../../goldenlayout.css';

	let goldenLayout: VirtualLayout;
	export const layoutConfig: Writable<LayoutConfig> = writable({
		settings: {
			showPopoutIcon: false
		},
		dimensions: {
			headerHeight: 32
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

	onMount(() => {
		virtualLayout.set(goldenLayout);
		const initialResolvedLayout = get(resolvedLayout);
		if (!initialResolvedLayout) {
			resolvedLayout.set(goldenLayout.saveLayout());
		}

		try {
			layoutConfig.set(LayoutConfig.fromResolved(initialResolvedLayout as ResolvedLayoutConfig));
		} catch (error) {
			console.error(
				"Failed to parse layoutConfig from localStorage. It's probably corrupted.",
				error
			);
			resolvedLayout.set(undefined);
		}

		goldenLayout.on('stateChanged', () => {
			if (JSON.stringify(goldenLayout.saveLayout()) === JSON.stringify(get(resolvedLayout))) return;
			resolvedLayout.set({ ...goldenLayout.saveLayout(), ignoreReload: true });
		});

		const sub = resolvedLayout.subscribe((layout) => {
			if (!layout) return;
			if (!layout.ignoreReload) {
				goldenLayout.loadLayout(LayoutConfig.fromResolved(layout));
			}
		});
		return () => {
			sub();
		};
	});

	const identity = (x: JsonValue) => x as object;
	const svelteComponentMap = (componentType: string) => {
		return dashboard_components[componentType as keyof typeof dashboard_components];
	};
</script>

<div class="w-full h-full overflow-clip z-0">
	<GoldenLayout config={$layoutConfig} let:componentType let:componentState bind:goldenLayout>
		<Lazy this={svelteComponentMap(componentType)} {...identity(componentState)}></Lazy>
	</GoldenLayout>
</div>
