<script lang="ts">
	export let record: { [key: string]: any } = {};
	let expanded = false;
	const onLogItemClick = () => (expanded = !expanded);
</script>

<tr on:click={onLogItemClick}>
	<td>
		{record.collectionName}
	</td>
	<td>
		{record.created}
	</td>
</tr>

{#if expanded}
	<div class="bg-surface-500-400-token text-on-surface-token w-max">
		<pre>{JSON.stringify(record, null, 4)}</pre>
	</div>
{/if}
