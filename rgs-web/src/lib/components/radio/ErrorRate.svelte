<script lang="ts">
    import { browser } from "$app/environment";
    import type { LinkStatus } from "../../../../../hydra_provider/bindings/LinkStatus";
    import { onSocket, socket } from "$lib/common/socket";
    import Speedometer from "svelte-speedometer"
    import { isDarkTheme } from "../../common/utils";


    let radio_msg: LinkStatus[] = [];
    let text_color: string;

    onSocket("LinkStatus", (msg: LinkStatus) => {
        radio_msg = [...radio_msg, msg];
    })

    if (isDarkTheme()) {
        text_color = "white"
    } else {
        text_color = "black"
    }

</script>

<div class="card shadow-xl w-full h-full place-items-center mt-20">
        <Speedometer
            value= {(radio_msg[radio_msg.length - 1]?.recent_error_rate*100).toFixed(2)}
            minValue={0}
            maxValue={100}
            segments={10}
            needleColor="black"
            startColor="green"
            endColor="red"
            textColor={text_color}
            needleTransitionDuration={4000}
            needleTransition="easeElastic"
            currentValueText="Error Rate: {(radio_msg[radio_msg.length - 1]?.recent_error_rate*100).toFixed(2)}%"
            height={400}
            width={400}
        />
</div>