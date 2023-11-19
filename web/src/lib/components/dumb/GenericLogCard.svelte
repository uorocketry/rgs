<script lang="ts">
	export let data: unknown | { [key: string]: unknown};
	$: dataAsKeys = data as { [key: string]: unknown};
	export let timestamp: string;
	let expanded = false;
	const onLogItemClick = () => (expanded = !expanded);
</script>

<div class="col-span-3 hover:bg-surface-300 grid grid-cols-3">
	<button class="col-span-3 grid grid-cols-3 gap-1 text-left" on:click={onLogItemClick}>
		<div>{Object.keys(dataAsKeys)[0] || ''}</div>
		<div class="col-span-2">{timestamp}</div>
	</button>
	{#if expanded}
		<div class="bg-surface-500 col-span-3 text-white">
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	{/if}
</div>

