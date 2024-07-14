<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import { RadioStatus } from './types';
	$: data = $RadioStatus.data?.rocket_radio_status[0];
	$: {
		delete data?.created_at;
	}
</script>

<div class="w-full h-full table-container">
	<table class="table table-compact w-full">
		<thead>
			<tr>
				<th>Field</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			<!-- Iterate over the entries of the current_msg object -->
			{#if data}
				{#each Object.entries(data) as [key, val]}
					<!-- On click, copy the value to the clipboard and add a visual effect -->
					<tr use:clipboard={`${key},${val}`} class="clicky">
						<td class="text-left">{key}</td>
						<td class="text-right">{val}</td>
					</tr>
				{/each}
			{:else}
				<tr>
					<td class="text-center" colspan="2">No data</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
