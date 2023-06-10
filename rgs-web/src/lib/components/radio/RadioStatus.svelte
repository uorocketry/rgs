<script lang="ts">
	import type { LinkStatus } from '../../../../../hydra_provider/bindings/LinkStatus';
	import { onSocket, socket } from '$lib/common/socket';

	let radio_msg: LinkStatus[] = [];

	onSocket('LinkStatus', (msg: LinkStatus) => {
		radio_msg = [...radio_msg, msg];
	});

	$: current_msg = radio_msg[radio_msg.length - 1];
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
			{#if current_msg}
				{#each Object.entries(current_msg) as [key, val]}
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
