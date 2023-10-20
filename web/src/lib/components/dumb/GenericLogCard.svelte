<!-- TODO: Refactor needed,  -->
<script lang="ts">

	export let data: unknown;
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

<button class="col-span-3 hover:bg-slate-100" on:click={onLogItemClick}>
	<div class="grid grid-cols-3 gap-1 text-left">
		<div>{Object.keys(data)[0] || ''}</div>
		<div class="col-span-2">{timestamp}</div>
		 {#if expanded}
		 	<div class="bg-slate-500 col-span-3 text-white">
				<pre>
					{JSON.stringify(data, null, 4)}
				</pre>
			</div>
		 {/if}
	</div>
</button>
