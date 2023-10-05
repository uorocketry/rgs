<script lang="ts">
	import { layoutConfig } from '$lib/common/layoutStore';
	import { LayoutConfig, type ResolvedLayoutConfig } from 'golden-layout';
	import type { UnsubscribeFunc } from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import { pb } from '../../../stores';

	let layouts = new Map<string, { name: string; data: ResolvedLayoutConfig }>();

	let unsubscribeF: UnsubscribeFunc | undefined = undefined;
	onMount(async () => {
		let allLayouts = await pb.collection('layouts').getFullList({
			$autoCancel: false
		});
		layouts = new Map(allLayouts.map((l) => [l.id, { name: l.name, data: l.export().data }]));
		unsubscribeF = await pb.collection('layouts').subscribe('*', (data) => {
			// data.action is create, update, delete
			if (data.action === 'create' || data.action === 'update') {
				layouts.set(data.record.id, {
					name: data.record.name,
					data: data.record.data
				});
			} else if (data.action === 'delete') {
				layouts.delete(data.record.id);
			}
			layouts = layouts;
		});
	});

	onDestroy(() => {
		unsubscribeF?.();
	});

	function loadLayout(layoutId: string) {
		let layout = layouts.get(layoutId);
		if (!layout) return;
		layoutConfig.set(LayoutConfig.fromResolved(layout.data));
	}

	let toDelete: string | undefined = undefined;
	let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
	function deletePanel(id: string) {
		if (timeout) clearTimeout(timeout);
		if (id === toDelete) {
			pb.collection('layouts').delete(id);
			toDelete = undefined;
			return;
		}

		toDelete = id;
		timeout = setTimeout(() => {
			toDelete = undefined;
		}, 1000);
	}
</script>

<div class="w-full h-full overflow-x-auto">
	<table class="table table-sm table-pin-rows w-full">
		<thead>
			<tr>
				<th />
				<th>Layout Name</th>
				<th>Layout ID</th>
			</tr>
		</thead>
		<tbody>
			<!-- Iterate over the entries of the current_msg object -->
			{#if layouts.size > 0}
				{#each [...layouts] as [key, val]}
					<!-- On click, copy the value to the clipboard and add a visual effect -->
					<tr on:click={() => loadLayout(key)} class="hover clicky cursor-pointer">
						<td class="">
							<button
								class="btn btn-xs"
								on:click={(e) => {
									e.stopPropagation();
									deletePanel(key);
								}}
							>
								{#if key !== toDelete}
									🗑️
								{:else}
									❓
								{/if}
							</button>
						</td>
						<td class="text-left">{val.name}</td>
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
</div>
