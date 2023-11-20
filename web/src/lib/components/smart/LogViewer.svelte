<script lang="ts">
	import { Collections } from '$lib/common/pocketbase-types';
	import { pb } from '$lib/stores';
	import type { RecordModel, UnsubscribeFunc } from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import CheckboxSelect from '../dumb/CheckboxSelect.svelte';
	import GenericLogCard from '../dumb/GenericLogCard.svelte';

	// Collections is a string->string enum
	// we want to get all keys separatelly
	const viewLimit = 100;
	let selected: string[] = [];
	let logs: RecordModel[] = [];

	function writableManager(collection: Collections) {
		let unsub: UnsubscribeFunc | undefined = undefined;
		let state = writable(false);
		let oldState = false;
		state.subscribe(async (s) => {
			if (!oldState && s) {
				// from disabled to enabled
				pb.collection(collection)
					.subscribe('*', (d) => {
						if (d.action === 'create') {
							logs = [d.record, ...logs];
							logs.length = logs.length > viewLimit ? viewLimit : logs.length;
						}
					})
					.then((u) => {
						unsub = u;
					});
			} else if (oldState && !s) {
				// from enabled to disabled
				unsub?.();
				unsub = undefined;
			}
			oldState = s;
		});

		onDestroy(() => {
			unsub?.();
		});

		return state;
	}

	const collections = Object.values(Collections);
	// Key(string) -> Value(writable) map of collections
	const collectionManagers = new Map<string, ReturnType<typeof writableManager>>();
	collections.forEach((c) => {
		collectionManagers.set(c, writableManager(c));
	});

	function enableAll() {
		collectionManagers.forEach((c) => c.set(true));
	}

	function disableAll() {
		collectionManagers.forEach((c) => c.set(false));
	}

	let paused = false;

	onMount(() => {
		// enableAll();
	});

	$: if (selected) {
		// Disable all collections not selected
		for (let c of collections) {
			if (!selected.includes(c)) {
				collectionManagers.get(c)?.set(false);
			} else {
				collectionManagers.get(c)?.set(true);
			}
		}
	}

	const handlePause = () => {
		paused = !paused;
		if (!paused) {
			// Enable all selected collections
			for (let c of selected) {
				collectionManagers.get(c)?.set(true);
			}
		} else {
			for (let c of selected) {
				collectionManagers.get(c)?.set(false);
			}
		}
	};
</script>

<div class="h-full flex flex-col">
	<div class="p-2 flex gap-2">
		<button
			title="Pause/Resume Logs"
			class="btn
		{paused ? 'variant-soft-success' : 'variant-soft-error'}
		"
			on:click={handlePause}
		>
			<i class=" fas fa-solid {paused ? 'fa-play' : 'fa-pause'}" />
		</button>

		<button title="Clear Logs" class="btn variant-filled" on:click={() => (logs = [])}>
			<i class="fas fa-solid fa-trash" />
		</button>

		<CheckboxSelect dropdownLabel="Collections" options={collections ?? []} bind:selected />

		<!-- Button for enable and disable all -->
		<button class="btn variant-filled" on:click={enableAll}> Enable All </button>

		<button class="btn variant-filled" on:click={disableAll}> Disable All </button>
	</div>

	<!-- Clear -->

	<div class="table-container">
		<table class="table table-compact table-hover">
			<thead>
				<tr>
					<th>Type</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				{#each logs as log}
					<GenericLogCard record={log} />
				{/each}
			</tbody>
		</table>
	</div>
</div>
