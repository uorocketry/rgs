<script lang="ts">
	import { pb } from '$lib/stores';
	import type { Data } from '@rgs/bindings';
	import type { RecordModel } from 'pocketbase';
	import GenericLogCard from '../dumb/GenericLogCard.svelte';

	interface pbResult extends RecordModel {
		data: Data;
	}

	let logsPromise = pb.collection('raw').getList<pbResult>(1, 100, {
		sort: '-created'
	});

	let search = '';
	let searchTimer: NodeJS.Timeout;

	const onSearch = () => {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			logsPromise =
				search.length === 0
					? pb.collection('raw').getList<pbResult>(1, 100, {
							sort: '-created'
					  })
					: pb.collection('raw').getList<pbResult>(1, 30, {
							filter: `data ~ '${search}'`,
                            sort: `-created`
					  });
		}, 1000);
	};
</script>

<div class="flex justify-center">
	<div class="w-8/12 overflow-auto">
		{#await logsPromise}
			<span class="loading loading-spinner loading-lg"></span>
		{:then logs}
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
					{#each logs.items as { data, updated }}
						<GenericLogCard {data} timestamp={updated} />
					{/each}
				</tbody>
			</table>
		{:catch err}
			Fetching logs failed: {err.message}
		{/await}
	</div>
</div>
