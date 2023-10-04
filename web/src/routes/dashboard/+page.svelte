<script lang="ts">
	import '../../goldenlayout.css';
	import GoldenLayout from 'svelte-golden-layout';
	import { layoutComponents, layoutConfig, virtualLayout } from '$lib/common/layoutStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { VirtualLayout } from 'golden-layout';

	let goldenLayout: VirtualLayout;

	$: {
		virtualLayout.set(goldenLayout);
	}

	onMount(() => {
		goldenLayout.on('stateChanged', () => {
			let config = get(virtualLayout);
			if (config === undefined) {
				return;
			}
			localStorage.setItem('layoutConfig', JSON.stringify(config.saveLayout()));
			console.info('Layout state saved');
		});
	});

	const identity = (x: any) => x;
	const svelteComponentMap = (componentType: string) => {
		return layoutComponents[componentType as keyof typeof layoutComponents];
	};
</script>

<div class="w-full h-full overflow-clip z-0">
	<GoldenLayout config={$layoutConfig} let:componentType let:componentState bind:goldenLayout>
		<svelte:component this={svelteComponentMap(componentType)} {...identity(componentState)} />
	</GoldenLayout>
</div>
