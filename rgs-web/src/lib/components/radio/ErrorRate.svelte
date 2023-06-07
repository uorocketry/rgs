<script lang="ts">
  import { browser } from "$app/environment";
  import type { LinkStatus } from "../../../../../hydra_provider/bindings/LinkStatus";
  import { onSocket, socket } from "$lib/common/socket";
  import Speedometer from "svelte-speedometer";
  import { isDarkTheme } from "../../common/utils";

  let radio_msg: LinkStatus[] = [];
  let text_color: string;

  let clientHeight = 0;
  let clientWidth = 0;
  let curDim = 200;

  onSocket("LinkStatus", (msg: LinkStatus) => {
    radio_msg = [...radio_msg, msg];
  });

  if (isDarkTheme()) {
    text_color = "white";
  } else {
    text_color = "black";
  }

  $: if (clientHeight && clientWidth) {
    let minDim = Math.min(clientHeight, clientWidth);
    if (minDim < 200) {
      curDim = minDim;
    } else {
      curDim = 200;
    }
    rerender++;
  }
  let rerender = 0;
</script>

<!-- Centered Speedometer -->
<div class="w-full h-full" bind:clientHeight bind:clientWidth>
  {#key rerender}
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
      needleTransitionDuration={4000}
      needleTransition="easeElastic"
      currentValueText="Error Rate: {(
        radio_msg[radio_msg.length - 1]?.recent_error_rate * 100
      ).toFixed(2)}%"
      width={clientWidth}
      height={clientHeight}
    />
  {/key}
</div>
