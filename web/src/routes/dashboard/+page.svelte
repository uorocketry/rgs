<script lang="ts">
	import {
		layoutComponents,
		layoutConfig,
		startLayout,
		virtualLayout
	} from '$lib/common/layoutStore';
	import Lazy from '$lib/components/smart/Lazy.svelte';
	import type { JsonValue, VirtualLayout } from 'golden-layout';
	import { onMount } from 'svelte';
	import GoldenLayout from 'svelte-golden-layout';
	import { get } from 'svelte/store';
	import '../../goldenlayout.css';

	let goldenLayout: VirtualLayout;

	$: {
		virtualLayout.set(goldenLayout);
	}

	onMount(() => {
		startLayout();
		goldenLayout.on('stateChanged', () => {
			let config = get(virtualLayout);
			if (config === undefined) {
				return;
			}
			localStorage.setItem('layoutConfig', JSON.stringify(config.saveLayout()));
			console.info('Layout state saved');
		});
	});

	const identity = (x: JsonValue) => x as object;
	const svelteComponentMap = (componentType: string) => {
		const component = layoutComponents[componentType as keyof typeof layoutComponents];
		return component;
	};
</script>

<div class="w-full h-full overflow-clip z-0">
	<GoldenLayout config={$layoutConfig} let:componentType let:componentState bind:goldenLayout>
		<Lazy this={svelteComponentMap(componentType)} {...identity(componentState)}></Lazy>
	</GoldenLayout>
</div>
