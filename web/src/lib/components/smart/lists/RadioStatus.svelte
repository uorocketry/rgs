<script lang="ts">
	import { linkStatus } from '$lib/realtime/linkStatus';
</script>

<div class="w-full h-full overflow-x-auto">
	<table class="table table-sm table-pin-rows w-full">
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
					<tr
						on:click={() => navigator.clipboard.writeText(`${key},${val}`)}
						class="hover clicky cursor-pointer"
					>
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
