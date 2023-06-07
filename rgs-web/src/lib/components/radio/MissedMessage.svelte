<script lang="ts">
    import type { LinkStatus } from "../../../../../hydra_provider/bindings/LinkStatus";
    import { onSocket, socket } from "$lib/common/socket";
    import Bar from "svelte-chartjs/src/Bar.svelte";

    let timestamp: bigint[] = [];
    let missed_msgs: number[] = [];
    let messages: LinkStatus[] = [];
    let chartRef: Bar;
    let totalMessages: number = 0;

    onSocket("LinkStatus", (msg: LinkStatus) => {
        messages = [...messages, msg];
        timestamp.push(msg.timestamp);
        if (messages.length > 1) {
            let diff = messages[messages.length - 1].missed_messages - messages[messages.length - 2].missed_messages;
            missed_msgs.push(diff);
        }
        chartRef.$set({ data: dataline });
        totalMessages = msg.missed_messages;

    });

    

    function randomCol(): string {
        return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
        })`;
    }

let dataline = {
        labels: timestamp,
        datasets: [
            {
                label: "Missed Messages",
                data: missed_msgs,
                backgroundColor: [randomCol(), randomCol(), randomCol(), randomCol(), randomCol()],
                borderWidth: 2,
                borderColor: randomCol(),
            }
            ]
        };

</script>

<div class="w-full h-full grid place-items-center">
    <Bar bind:this={chartRef} bind:data={dataline} options={{ responsive: true }} />
    <p class="gap-0 "> Total Messages: {totalMessages}</p>
</div>  