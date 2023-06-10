<script lang="ts" type="module">
	import { formatVariableName, getRandomHexColorFromString } from '$lib/common/utils';

	import { Scatter } from 'svelte-chartjs';
	import CheckboxSelect from '../CheckboxSelect.svelte';
	import { collectionFields } from '$lib/common/dao';
	import { pb } from '$lib/stores';
	import type { UnsubscribeFunc } from 'pocketbase';

	export let selected: { [key: string]: string[] } = {};

	const options = {
		maintainAspectRatio: false,
		showLine: true,
		// Update x axis to convert timestamp to date
		scales: {
			x: {
				ticks: {
					callback: function (tickValue: string | number) {
						let date = new Date(Number(tickValue));
						return date.toLocaleTimeString();
					}
				}
			}
		}
	};

	let subscriptions: UnsubscribeFunc[] = [];

	let datasetsRef: any[] = [];

	refreshChart();

	function createDataset(name: string, colorSeed: string) {
		return {
			label: formatVariableName(name),
			lineTension: 0.0,
			borderColor: getRandomHexColorFromString(colorSeed),
			pointBorderWidth: 10,
			pointHoverRadius: 10,
			pointHoverBorderWidth: 2,
			data: [{ x: 0, y: 0 }]
		};
	}

	const POINT_LIMIT = 10;
	let dataRecords: Map<string, { x: number; y: number }[]> = new Map();

	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	async function refreshChart() {
		// Unsubscribe from previous collections
		for (const unsub of subscriptions) {
			unsub();
		}
		subscriptions = [];

		let datasets: any[] = [];

		// Populate the datasets array with the data from the dataset map
		let canUpdate = false;
		for (const entry of Object.entries(selected)) {
			if (entry[1].length > 0) {
				// Download the data
				const collection = pb.collection(entry[0]);

				// Crete line datasets
				const fields = entry[1];
				4;
				for (const key of fields) {
					const recordKey = entry[0] + key;

					let dataset: any = createDataset(key, entry[0] + key);

					datasets.push(dataset);

					// Create subscriber
					let unsub = await collection.subscribe('*', (data) => {
						// Add the new data to the dataset
						if (!canUpdate) {
							return;
						}

						if (!dataRecords.has(recordKey)) {
							dataRecords.set(recordKey, []);
						}
						let dataPoints = dataRecords.get(recordKey) ?? [];
						dataset.data = dataPoints;

						// Add the new data point
						if (data.action === 'create') {
							dataPoints.push({
								x: Date.parse(data.record.created),
								y: data.record[key]
							});

							if (dataPoints.length > POINT_LIMIT * 2) {
								dataPoints.splice(0, POINT_LIMIT / 2);
							}

							datasetsRef = datasets;
						}
					});
					subscriptions.push(unsub);
				}
			}
		}

		canUpdate = true;
	}

	let clientWidth = 0;
	let clientHeight = 0;

	// HACK To force restart of the chart component
	let restart = 0;
	let restartCount = 0;

	$: {
		clientHeight;
		clientWidth;
		restartCount += 1;
		if (restartCount % 2 == 0) {
			restart += 1;
		}
	}

	$: if (selected) {
		refreshChart();
	}

	// Update collection entries
	let collectionsEntries: { key: string; value: string[] }[] = [];
	collectionFields.subscribe((fields) => {
		collectionsEntries = [];
		for (const [key, value] of fields.entries()) {
			collectionsEntries.push({ key, value });
		}
		collectionsEntries = [...collectionsEntries];
	});
</script>

<div class="w-full h-full flex flex-col" bind:clientHeight bind:clientWidth>
	<div>
		<!-- TODO: Checkbox not working(???) -->
		{#each collectionsEntries as collection}
			<CheckboxSelect
				dropdownLabel={formatVariableName(collection.key)}
				options={collection.value ?? []}
				bind:selected={selected[collection.key]}
			/>
		{/each}
	</div>

	<div class="flex-1 p-2">
		{#key restart}
			<Scatter
				{options}
				data={{
					datasets: datasetsRef
				}}
			/>
		{/key}
	</div>
</div>
