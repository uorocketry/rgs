<script lang="ts">
	import '../../goldenlayout.css';
	import GoldenLayout from 'svelte-golden-layout';
	import { LayoutManager, type VirtualLayout } from 'golden-layout';
	import { layoutComponents, layoutConfig, virtualLayout } from '$lib/common/layoutStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

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
			console.info('Saved layoutConfig to localStorage');
		});
	});
</script>

<div class="w-full h-full flex flex-col p-1 bg-accent/25">
	<div class="flex-1">
		<GoldenLayout config={$layoutConfig} let:componentType let:componentState bind:goldenLayout>
			<svelte:component this={layoutComponents[componentType]} {...componentState} />
		</GoldenLayout>
	</div>
</div>
