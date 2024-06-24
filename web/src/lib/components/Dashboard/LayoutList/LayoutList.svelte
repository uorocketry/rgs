<script lang="ts">
	import { resolvedLayout } from '$lib/common/dashboard';
	import { gqlClient } from '$lib/stores';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { DeleteLayoutDocument, LayoutList } from './types';

	// let layouts = new Map<string, { name: string; data: ResolvedLayoutConfig }>();
	$: layouts = $LayoutList.data?.web_layout?.reduce((acc, val) => {
		acc.set(val.id, { name: val.name, data: val.layout as string });
		return acc;
	}, new Map<number, { name: string; data: string }>());

	function loadLayout(layoutId: number) {
		let layout = layouts?.get(layoutId);
		if (!layout) return;
		resolvedLayout.set(JSON.parse(layout.data));
	}

	let toastStore = getToastStore();
	let toDelete: number | undefined = undefined;
	let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
	async function deletePanel(id: number) {
		if (timeout) clearTimeout(timeout);
		if (id === toDelete) {
			const r = await gqlClient.mutation(DeleteLayoutDocument, { id });
			console.log('Delete layout', r);
			if (r.data?.delete_web_layout?.affected_rows === 0 || r.error) {
				toastStore.trigger({
					message: r.error?.message || 'Failed to delete layout',
					background: 'variant-filled-error'
				});
				return;
			} else {
				toastStore.trigger({
					message: 'Layout deleted'
				});
			}
			toDelete = undefined;
			return;
		}

		toDelete = id;
		timeout = setTimeout(() => {
			toDelete = undefined;
		}, 1000);
	}
</script>

<div>Click on a layout to load it</div>

<table class="clear-user-agent-styles">
	<thead>
		<tr>
			<th style="width: 5rem;">Delete:</th>
			<th>Layout Name</th>
			<th>Layout ID</th>
		</tr>
	</thead>
	<tbody>
		<!-- Iterate over the entries of the current_msg object -->
		{#if layouts && layouts.size > 0}
			{#each [...layouts] as [key, val]}
				<!-- On click, copy the value to the clipboard and add a visual effect -->
				<tr on:click={() => loadLayout(key)}>
					<td
						class="cursor-pointer"
						on:click={(e) => {
							e.stopPropagation();
							deletePanel(key);
						}}
					>
						{#if key !== toDelete}
							<span class="warning"> DELETE </span>
						{:else}
							<span class="error"> CONFIRM </span>
						{/if}
					</td>
					<td class="text-left">{val.name} </td>
					<td class="text-right">{key}</td>
				</tr>
			{/each}
		{:else}
			<tr>
				<td class="text-center" colspan="3">No data</td>
			</tr>
		{/if}
	</tbody>
</table>

<style>
	table {
		width: 100%;
	}

	th,
	td {
		outline: 1px dashed var(--color-on-base);
		outline-offset: -1px;
	}

	tbody:has(td:hover) td {
		background-color: var(--color-on-base);
		color: var(--color-base);
		outline: 1px dashed var(--color-base) !important;

		outline-offset: -1px;
	}

	.warning {
		color: var(--color-warning);
	}

	.error {
		color: var(--color-error);
	}
</style>
