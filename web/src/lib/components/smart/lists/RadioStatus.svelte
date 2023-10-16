<script lang="ts">
	import { linkStatus } from '$lib/realtime/linkStatus';
	import { clipboard } from '@skeletonlabs/skeleton';
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
			{#if $linkStatus}
				{#each Object.entries($linkStatus) as [key, val]}
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
