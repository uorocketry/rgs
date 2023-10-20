<!-- TODO: Refactor needed,  -->
<script lang="ts">
	import type { Data } from '@rgs/bindings';

	export let data: Data;
	export let timestamp: string

	function formatData(data: unknown) {
		// Fixed decimal places for floats
		if (typeof data === 'number' && data % 1 !== 0) {
			return data.toFixed(4);
		}
		return data;
	}


	let timeFormat = new Intl.DateTimeFormat('en', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});

	let expanded = false;

	const onLogItemClick = () => expanded = !expanded;

</script>



	<tr class="hover" on:click={onLogItemClick}>
		<td>{Object.keys(data)[0]}</td>
		<td>{timestamp}</td>
	</tr>
	{#if expanded}
		<tr class="bg-slate-500 text-white">
			<td colspan="3">
				<pre>
					{JSON.stringify(data, null, 4)}
				</pre>
			</td>
		</tr>
	{/if}