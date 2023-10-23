<script lang="ts">
	import { Collections, type LayoutsResponse } from '$lib/common/pocketbase-types';
	import type { ResolvedLayoutConfig } from 'golden-layout';
	import type { UnsubscribeFunc } from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import { resolvedLayout } from '../../../common/dashboard';
	import { pb } from '../../../stores';

	let layouts = new Map<string, { name: string; data: ResolvedLayoutConfig }>();

	let unsubscribeF: UnsubscribeFunc | undefined = undefined;
	onMount(async () => {
		let allLayouts = await pb.collection(Collections.Layouts).getFullList<LayoutsResponse>({
			$autoCancel: false
		});
		layouts = new Map(
			allLayouts.map((l) => [l.id, { name: l.name, data: l.data }])
		) as typeof layouts;
		unsubscribeF = await pb
			.collection(Collections.Layouts)
			.subscribe<LayoutsResponse<ResolvedLayoutConfig>>('*', (data) => {
				if (data.action === 'update' || data.action === 'create') {
					if (!data.record.data) {
						console.error(
							`Layout ${data.record.name} (${data.record.id}) of the layouts doesn't have data`
						);
					} else {
						layouts.set(data.record.id, {
							name: data.record.name,
							data: data.record.data
						});
					}
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
		console.log(layout);
		if (!layout) return;
		resolvedLayout.set(layout.data);
	}

	let toDelete: string | undefined = undefined;
	let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
	function deletePanel(id: string) {
		if (timeout) clearTimeout(timeout);
		if (id === toDelete) {
			pb.collection(Collections.Layouts).delete(id);
			toDelete = undefined;
			return;
		}

		toDelete = id;
		timeout = setTimeout(() => {
			toDelete = undefined;
		}, 1000);
	}
</script>

<div class="w-full h-full table-container overflow-x-auto">
	<table class="table table-compact w-full">
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
					<tr class="cursor-pointer" on:click={() => loadLayout(key)}>
						<td>
							<button
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
