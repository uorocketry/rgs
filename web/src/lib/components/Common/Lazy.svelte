<script lang="ts">
	import { onDestroy, type ComponentType } from 'svelte';

	type $$Props = {
		this: () => Promise<{ default: ComponentType }>; // Expecting dynamic import
		[key: string]: any; // To allow for rest props
	};

	let { this: loadComponentFn, ...restProps } = $props();

	let component = $state<ComponentType | null>(null);
	let error = $state<Error | null>(null);

	$effect(() => {
		let cancelled = false;
		component = null; // Reset on prop change
		error = null;

		loadComponentFn()
			.then((module: { default: ComponentType }) => {
				if (!cancelled) {
					component = module.default;
				}
			})
			.catch((err: unknown) => {
				if (!cancelled) {
					console.error('Failed to load component:', err);
					error = err instanceof Error ? err : new Error(String(err));
				}
			});

		onDestroy(() => {
			cancelled = true;
		});
	});
</script>

{#if component}
	{@const Comp = component}
	<Comp {...restProps} />
{:else if error}
	<slot name="error">
		<div class="alert alert-error">
			<span>Failed to load component: {error.message}</span>
		</div>
	</slot>
{:else}
	<slot name="loading">
		<div class="flex flex-col items-center justify-center w-full h-full gap-4">
			<span>Loading...</span>
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	</slot>
{/if}
