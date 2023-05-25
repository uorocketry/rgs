<script lang="ts">
    import type { LinkStatus } from "../../../../../hydra_provider/bindings/LinkStatus";
    import { onSocket, socket } from "$lib/common/socket";
    import Bar from "svelte-chartjs/src/Bar.svelte";

    let timestamp: bigint[] = [];
    let missed_msgs: number[] = [];
    let chartRef: Bar;

    onSocket("LinkStatus", (msg: LinkStatus) => {
        timestamp.push(msg.timestamp);
        missed_msgs.push(msg.missed_messages);
        chartRef.$set({ data: dataline });
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
    <p class="gap-4 "> Total Messages: {missed_msgs[missed_msgs.length]}</p>
</div>  