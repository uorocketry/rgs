<script lang="ts">
	import { Collections, type RawResponse } from '$lib/common/pocketbase-types';
	import { latestCollectionWritable } from '$lib/realtime/lastestCollectionWritable';
	import { pb } from '$lib/stores';
	import { onMount } from 'svelte';
	import GenericLogCard from '../dumb/GenericLogCard.svelte';

	let logs: RawResponse[] = []; // logs to display
	let updatedLogs: RawResponse[] = []; // up to date logs
	let search = '';
	let paused = false;
	let pauseDisabled = false;

	onMount(() => {
		pb.collection('raw')
			.getList(1, 100, {
				sort: '-created'
			})
			.then((l) => {
				logs = l.items;
				updatedLogs = logs.slice();
			});

		const unsub = latestCollectionWritable(Collections.Raw).subscribe((r) => {
			if (!r) {
				return;
			}

			// append new logs to top of list
			updatedLogs = [r, ...updatedLogs];
			// make sure the list doesn't go over 1000 (prevent memory leak)
			updatedLogs.length = updatedLogs.length > 1000 ? 1000 : updatedLogs.length;
			if (!paused && !pauseDisabled) {
				logs = updatedLogs.slice();
			}
		});
		return () => {
			unsub();
		};
	});

	const handleSearch = async (e: KeyboardEvent) => {
		if (e.key == 'Enter') {
			if (search.length == 0) {
				logs = (
					await pb.collection('raw').getList(1, 100, {
						sort: '-created'
					})
				).items;
				pauseDisabled = false;
			} else {
				logs = (
					await pb.collection('raw').getList(1, 30, {
						filter: `data ~ '${search}'`,
						sort: `-created`
					})
				).items;
				pauseDisabled = true;
			}
		}
	};

	const handlePause = () => {
		paused = !paused;
		if (!paused) {
			logs = updatedLogs.slice();
		}
	};
</script>

<div class="flex justify-center">
	<div class="w-8/12 overflow-auto">
		{#if !logs}
			<span class="loading loading-spinner loading-lg"></span>
		{:else}
			<div class="h-screen grid grid-cols-3 gap-1 overflow-auto">
				<div class="">Type</div>
				<div class="">Time</div>
				<div class="flex">
					<input
						on:keypress={handleSearch}
						type="text"
						placeholder="Search"
						class="input input-bordered input-xs w-full max-w-xs"
						bind:value={search}
					/>
					<button type="button" class="btn" on:click={handlePause} disabled={pauseDisabled}>
						{#if !paused}
							<i class="text-surface-800-100-token fas fa-solid fa-pause text-xl" />
						{:else}
							<i class="text-surface-800-100-token fas fa-solid fa-play text-xl" />
						{/if}
					</button>
				</div>
				{#each logs as log, idx (log.id)}
					<GenericLogCard data={log.data} timestamp={log.updated} />
				{/each}
			</div>
		{/if}
	</div>
</div>
