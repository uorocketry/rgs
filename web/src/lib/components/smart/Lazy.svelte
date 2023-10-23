<script lang="ts">
	import { onMount } from 'svelte';

	let loadComponent: () => Promise<any>;
	export { loadComponent as this };

	let isShowingComponent = false;
	let componentPromise: Promise<any>;
	onMount(() => {
		//
		componentPromise = loadComponent();
	});
</script>

{#await componentPromise}
	<slot name="loading">Loading...</slot>
{:then component}
	{@debug component}
	<svelte:component this={component} {...$$restProps} />
{/await}
