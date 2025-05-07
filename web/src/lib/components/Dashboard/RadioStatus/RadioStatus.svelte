<script lang="ts">
	// import { clipboard } from '@skeletonlabs/skeleton'; // Removed
	// import { RadioStatus } from './types'; // Removed - types.ts is not a module and RadioStatus wasn't used

	// Use $derived for Svelte 5 runes mode reactivity
	let data = $derived($RadioStatus.data?.rocket_radio_status[0]);

	// Removed reactive block that mutated derived state:
	// $: {
	// 	delete data?.created_at;
	// }

	// Function to copy text to clipboard using browser API
	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			// Optional: Add user feedback (e.g., toast notification)
			console.info('Copied to clipboard:', text);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}
</script>

<div class="w-full h-full table-container overflow-x-auto">
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
				{#each Object.entries(data).filter(([key]) => key !== 'created_at') as [key, val]}
					<!-- On click, copy the value to the clipboard -->
					<!-- Added cursor-pointer and onclick handler -->
					<tr onclick={() => copyToClipboard(`${key}: ${val}`)} class="hover cursor-pointer">
						<td class="font-mono text-left">{key}</td>
						<td class="font-mono text-right">{val}</td>
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
