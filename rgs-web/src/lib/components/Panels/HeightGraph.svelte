<script lang="ts" type="module">
    import { onSocket } from "$lib/common/socket";
    import { onInterval } from "$lib/common/utils";

    import type { Message } from "../../../../../hydra_provider/bindings/Message";
    import type { Data } from "../../../../../hydra_provider/bindings/Data";
    import type { Sensor } from "../../../../../hydra_provider/bindings/Sensor";
    import Line from "svelte-chartjs/src/Line.svelte";


    let timestamp: bigint[] = [];
    let pressure: number[] = [];


    onSocket("RocketMessage", (msg: Message) => {
        const data: Data = msg.data as { sensor: Sensor };
        if (data.sensor?.data?.Sbg == null) return;
        const sbg = data.sensor.data.Sbg;

        timestamp.push(msg.timestamp);
        pressure.push(sbg.height);
    });

    const dataline = {
        labels: timestamp,
        datasets: [
            {
                label: "Height",
                lineTension: 0.3,
                backgroundColor: 'rgba(225, 204,230, .3)',
                borderColor: 'rgb(205, 130, 158)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(205, 130,1 58)',
                pointBackgroundColor: 'rgb(255, 255, 255)',
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(0, 0, 0)',
                pointHoverBorderColor: 'rgba(220, 220, 220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: pressure,
            },
        ],
    };

    let chartRef: Line;
    onInterval(() => {
        chartRef.$set({ data: dataline });
    }, 1000);

</script>

<Line bind:this={chartRef} data={dataline} options={{ responsive: true, maintainAspectRatio: false }} />
