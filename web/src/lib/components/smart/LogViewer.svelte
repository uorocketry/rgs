<script lang="ts">
	import type { RawResponse } from '$lib/pocketbase-types';
	import { pb } from '$lib/stores';
	import { onMount } from 'svelte';
	import GenericLogCard from '../dumb/GenericLogCard.svelte';

	let logs: RawResponse[] = []

	let search = '';

	onMount(async ()=> {
		logs = (await  pb.collection('raw').getList(1, 100, {
			sort: '-created'
		})).items 

		pb.collection('raw').subscribe("*", (r) => {
			console.log(r);
			if(r.action === "create") {
				logs.push(r.record)
				logs = logs;
			}
		})

	})

	const handleSearch = async (e: KeyboardEvent) => {
		if (e.key == 'Enter') {
			logs =
				search.length === 0
					? (await pb.collection('raw').getList(1, 100, {
							sort: '-created'
					  })).items
					: (await  pb.collection('raw').getList(1, 30, {
							filter: `data ~ '${search}'`,
                            sort: `-created`
					  })).items;
		}
	};
</script>

<div class="flex justify-center">
	<div class="w-8/12 overflow-auto">
		{#if !logs}
			<span class="loading loading-spinner loading-lg"></span>
		{:else }
			<div class="h-screen grid grid-cols-3 gap-1 overflow-auto">
				<div class="">Type</div>
				<div class="">Time</div>
				<input
					on:keypress={handleSearch}
					type="text"
					placeholder="Search"
					class="input input-bordered input-xs w-full max-w-xs"
					bind:value={search}
				/>	
				<!-- {#key logs} -->
				{#each logs as { data, updated }}
					<GenericLogCard {data} timestamp={updated} />
				{/each}	
			</div>
		{/if}
	</div>
</div>
