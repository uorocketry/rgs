<script lang="ts">
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
	<slot name="loading">Loading...</slot>
{/if}
