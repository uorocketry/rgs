<script lang="ts" type="module">
	import { formatVariableName, getRandomHexColorFromString } from '$lib/common/utils';

	import { Scatter } from 'svelte-chartjs';
	import CheckboxSelect from '../CheckboxSelect.svelte';
	import { collectionFields } from '$lib/common/dao';
	import { pb } from '$lib/stores';
	import type { Collection, UnsubscribeFunc } from 'pocketbase';
	import type { ChartDataset, Point } from 'chart.js/auto';

	export let selected: { [key: string]: string[] } = {};
	let tooltipDesc: String;

	const options = {
		maintainAspectRatio: false,
		showLine: true,
		animation: {
			duration: 0
		},
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

	let datasetsRef: ChartDataset<'scatter', (number | Point)[]>[] = [];

	refreshChart();

	function createDataset(name: string, colorSeed: string) {
		return {
			label: formatVariableName(name),
			lineTension: 0.1,
			borderColor: getRandomHexColorFromString(colorSeed),
			pointBorderWidth: 10,
			pointHoverRadius: 10,
			pointHoverBorderWidth: 2,
			data: [{ x: 0, y: 0 }]
		};
	}

	const POINT_LIMIT = 50;
	let dataRecords: Map<string, { x: number; y: number }[]> = new Map();

	async function refreshChart() {
		// Unsubscribe from previous collections
		for (const unsub of subscriptions) {
			unsub();
		}
		subscriptions = [];

		let datasets: ChartDataset<'scatter', (number | Point)[]>[] = [];

		// Populate the datasets array with the data from the dataset map
		let canUpdate = false;
		for (const entry of Object.entries(selected)) {
			if (entry[1].length > 0) {
				// Download the data
				const collection = pb.collection(entry[0]);

				// Crete line datasets
				const fields = entry[1];
				for (const key of fields) {
					const recordKey = entry[0] + key;

					let dataset = createDataset(key, entry[0] + key);

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
							let time: any;
							console.log('time', time);
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
			// const keys = value.schema[0].name
			const keys = value.schema.map((schema) => schema.name);
			collectionsEntries.push({ key, value: keys });
		}
		collectionsEntries = [...collectionsEntries];
	});
</script>

<div class="w-full h-full flex flex-col bg-white" bind:clientHeight bind:clientWidth>
	<div class="flex flex-wrap justify-center">
		<!-- TODO: Checkbox not working(???) -->
		{#each collectionsEntries as collection}
			<div
				class="tooltip tooltip-bottom"
				data-tip={tooltipDesc}
				on:mouseenter={() => {
					if (collection.key == 'Air') {
						tooltipDesc = 'Air Sensor Metrics';
					} else if (collection.key == 'EkfNav1') {
						tooltipDesc = 'Navigation Velocity';
					} else if (collection.key == 'EkfNav2') {
						tooltipDesc = 'Navigation Position';
					} else if (collection.key == 'EkfQuat') {
						tooltipDesc = 'Quaternion Orientation Metrics';
					} else if (collection.key == 'GpsVel') {
						tooltipDesc = 'GPS Velocity Metrics';
					} else if (collection.key == 'Imu1') {
						tooltipDesc = 'IMU Accelerometer and Gyroscope Metrics';
					} else if (collection.key == 'Imu2') {
						tooltipDesc = 'IMU Delta Velocity and Angle Metrics';
					} else if (collection.key == 'LinkStatus') {
						tooltipDesc = 'Link Status';
					} else if (collection.key == 'Log') {
						tooltipDesc = 'Log';
					} else if (collection.key == 'State') {
						tooltipDesc = 'State';
					} else {
						tooltipDesc = '';
					}
				}}
				on:mouseleave={() => {
					tooltipDesc = '';
				}}
				aria-hidden="true"
			>
				<CheckboxSelect
					dropdownLabel={formatVariableName(collection.key)}
					options={collection.value ?? []}
					bind:selected={selected[collection.key]}
				/>
			</div>
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
