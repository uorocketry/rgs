<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount, type ComponentType } from 'svelte';

	let loadComponentFn: () => Promise<ComponentType>;
	export { loadComponentFn as this };

	let component: ComponentType | null = null;
	onMount(async () => {
		component = await loadComponentFn();
	});
</script>

{#if component}
	<svelte:component this={component} {...$$restProps} />
{:else}
	<slot name="loading">
		<div class="gap-4 justify-center flex flex-col place-items-center w-full h-full">
			<span> Loading... </span>
			<ProgressRadial value={undefined} />
		</div>
	</slot>
{/if}
