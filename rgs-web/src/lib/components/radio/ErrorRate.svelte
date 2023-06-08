<script lang="ts">
  import type { LinkStatus } from "../../../../../hydra_provider/bindings/LinkStatus";
  import { onSocket } from "$lib/common/socket";
  import Speedometer from "svelte-speedometer";

  let radio_msg: LinkStatus[] = [];
  let text_color: string;

  onSocket("LinkStatus", (msg: LinkStatus) => {
    radio_msg = [...radio_msg, msg];
  });

  let clientHeight = 0;
  let clientWidth = 0;
</script>

<!-- Centered Speedometer -->
<div class="w-full h-full flex p-2">
  <div class="flex-1 overflow-hidden" bind:clientHeight bind:clientWidth>
    <Speedometer
      value={(
        (radio_msg[radio_msg.length - 1]?.recent_error_rate ?? 0) * 100
      ).toFixed(2)}
      minValue={0}
      maxValue={100}
      segments={10}
      needleColor="black"
      startColor="green"
      endColor="red"
      textColor={text_color}
      needleTransitionDuration={750}
      needleTransition="easeCubicInOut"
      currentValueText="Error Rate: {(
        radio_msg[radio_msg.length - 1]?.recent_error_rate * 100
      ).toFixed(2)}%"
      fluidWidth={true}
      forceRender={true}
      width={clientWidth}
      height={clientHeight}
    />
  </div>
</div>
