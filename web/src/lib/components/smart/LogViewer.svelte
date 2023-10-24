<script lang="ts">
	import { pb } from '$lib/stores';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import GenericLogCard from '../dumb/GenericLogCard.svelte';

	let logs: RecordModel[] = []

	let search = '';
	let searchTimer: NodeJS.Timeout;


	onMount(async ()=> {
		logs = (await  pb.collection('raw').getList(1, 100, {
			sort: '-created'
		})).items 

		pb.collection('raw').subscribe("*", (r) => {
			if(r.action === "create") {
				logs.push(r.record)
			}
		})

	})

	const onSearch = async () => {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(async () => {
			logs =
				search.length === 0
					? (await pb.collection('raw').getList(1, 100, {
							sort: '-created'
					  })).items
					: (await  pb.collection('raw').getList(1, 30, {
							filter: `data ~ '${search}'`,
                            sort: `-created`
					  })).items;
		}, 1000);
	};
</script>

<div class="flex justify-center">
	<div class="w-8/12 overflow-auto">
		{#if !logs}
			<span class="loading loading-spinner loading-lg"></span>
		{:else }
			<table class="table table-xs table-fixed">
				<thead>
					<tr>
						<th>Type</th>
						<th>Time</th>
						<th>
							<input
								on:input={onSearch}
								type="text"
								placeholder="Search"
								class="input input-bordered input-xs w-full max-w-xs"
								bind:value={search}
							/>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each logs as { data, updated }}
						<GenericLogCard {data} timestamp={updated} />
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
