<script lang="ts">
	import { linkStatus } from '$lib/realtime/linkStatus';
	import { Bar } from 'svelte-chartjs';
	import type { RocketLinkResponse } from '../../../common/pocketbase-types';

	let timestamp: number[] = [];
	let missed_msgs: number[] = [];
	let messages: RocketLinkResponse[] = [];
	let totalMessages = 0;

	let data = {
		labels: timestamp,
		datasets: [
			{
				label: 'Missed Messages',
				data: missed_msgs,
				borderWidth: 2
			}
		]
	};

	const options = {
		maintainAspectRatio: false,
		showLine: true,
		responsive: true,
		animation: {
			duration: 0
		},
		// Update x axis to convert timestamp to date
		scales: {
			x: {
				ticks: {
					callback: function (tickValue: number) {
						let date = new Date(Number(timestamp[tickValue]));
						return date.toLocaleTimeString();
					}
				}
			}
		}
	};

	$: {
		if ($linkStatus) {
			messages = [...messages, $linkStatus];
			if (messages.length > 1) {
				timestamp.push(Date.now());
				let diff =
					messages[messages.length - 1].missed_messages -
					messages[messages.length - 2].missed_messages;
				missed_msgs.push(diff);
			}
			data = data;
			totalMessages = $linkStatus.missed_messages;
		}
	}

	let clientHeight = 0;
	let clientWidth = 0;
	let restartCount = 0;
	let restart = 0;
	$: {
		clientHeight;
		clientWidth;
		restartCount += 1;
		if (restartCount % 2 == 0) {
			restart += 1;
		}
	}
</script>

<div class="w-full h-full flex flex-col p-2" bind:clientHeight bind:clientWidth>
	<div class="flex-1">
		{#key restart}
			<Bar bind:data {options} />
		{/key}
	</div>
	<p class="text-center">Total Messages: {totalMessages}</p>
</div>
