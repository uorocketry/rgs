<script lang="ts">
	import type { LinkStatus } from '../../../../../hydra_provider/bindings/LinkStatus';
	import { onSocket, socket } from '$lib/common/socket';
	import { Bar } from 'svelte-chartjs';

	let timestamp: bigint[] = [];
	let missed_msgs: number[] = [];
	let messages: LinkStatus[] = [];
	let chartRef: Bar;
	let totalMessages = 0;

	let data = {
		labels: timestamp,
		datasets: [
			{
				label: 'Missed Messages',
				data: missed_msgs,
				backgroundColor: [randomCol(), randomCol(), randomCol(), randomCol(), randomCol()],
				borderWidth: 2,
				borderColor: randomCol()
			}
		]
	};

	onSocket('LinkStatus', (msg: LinkStatus) => {
		messages = [...messages, msg];
		timestamp.push(msg.timestamp);
		if (messages.length > 1) {
			let diff =
				messages[messages.length - 1].missed_messages -
				messages[messages.length - 2].missed_messages;
			missed_msgs.push(diff);
		}
		data = { ...data };
		totalMessages = msg.missed_messages;
	});

	function randomCol(): string {
		return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
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

<div class="w-full h-full flex flex-col items-center p-2" bind:clientHeight bind:clientWidth>
	<div class="flex-1">
		{#key restart}
			<Bar bind:data options={{ responsive: true, maintainAspectRatio: false }} />
		{/key}
	</div>
	<p>Total Messages: {totalMessages}</p>
</div>
