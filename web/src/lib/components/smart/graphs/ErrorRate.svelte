<script lang="ts">
	import { onCollectionCreated } from '$lib/common/utils';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import Speedometer from 'svelte-speedometer';

	let radio_msg: LinkStatus[] = [];
	$: text_color = $modeCurrent ? 'black' : 'white';
	let sub = () => {};

	onCollectionCreated('LinkStatus', async (msg: LinkStatus) => {
		radio_msg = [...radio_msg, msg];
	});

	onDestroy(() => {
		radio_msg = [];
		sub();
	});

	let clientHeight = 0;
	let clientWidth = 0;
</script>

<!-- Centered Speedometer -->
<div class="w-full h-full flex p-2">
	<div class="flex-1 overflow-hidden" bind:clientHeight bind:clientWidth>
		<Speedometer
			value={((radio_msg[radio_msg.length - 1]?.recent_error_rate ?? 0) * 100).toFixed(2)}
			minValue={0}
			maxValue={100}
			segments={10}
			needleColor="black"
			startColor="green"
			endColor="red"
			textColor={text_color}
			needleTransitionDuration={750}
			needleTransition="easeCubicInOut"
			currentValueText="Packet Loss: {(
				radio_msg[radio_msg.length - 1]?.recent_error_rate * 100
			).toFixed(2)}%"
			fluidWidth={true}
			forceRender={true}
			width={clientWidth}
			height={clientHeight}
		/>
	</div>
</div>
