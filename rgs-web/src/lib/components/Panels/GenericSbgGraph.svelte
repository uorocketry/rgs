<script lang="ts" type="module">
  import { onSocket } from "$lib/common/socket";
  import { formatVariableName, onInterval } from "$lib/common/utils";

  import type { Message } from "../../../../../hydra_provider/bindings/Message";
  import type { Data } from "../../../../../hydra_provider/bindings/Data";
  import type { Sensor } from "../../../../../hydra_provider/bindings/Sensor";
  import Line from "svelte-chartjs/src/Line.svelte";
  import type { Sbg } from "../../../../../hydra_provider/bindings/Sbg";
  import CheckboxSelect from "../CheckboxSelect.svelte";

  let timestamp: bigint[] = [];
  let pressure: number[] = [];
  let selected: string[] = [];
  let chartRef: Line;

  //   set of strings representing the sbg data fields
  export let y_field: keyof Sbg = "height";
  let fields = new Set<string>([y_field]);

  $: {
    if (selected.length > 0) {
      onLabelChange();
    }
  }

  function onLabelChange() {
    pressure = [];
    timestamp = [];

    if (chartRef) {
      refreshChart();
    }
  }

  onSocket("RocketMessage", (msg: Message) => {
    const data: Data = msg.data as { sensor: Sensor };
    if (data.sensor?.data?.Sbg == null) return;
    const sbg = data.sensor.data.Sbg;

    timestamp.push(msg.timestamp);
    pressure.push(sbg[y_field]);

    const sbgFields = Object.keys(sbg);
    fields = new Set([...fields, ...sbgFields]);

    if (chartRef) {
      chartRef.$set({ data: dataline });
    }
  });

  let dataline = {
    labels: timestamp,
    datasets: [
      {
        label: formatVariableName(y_field),
        lineTension: 0.3,
        backgroundColor: "rgba(225, 204,230, .3)",
        borderColor: "rgb(205, 130, 158)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(205, 130,1 58)",
        pointBackgroundColor: "rgb(255, 255, 255)",
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(0, 0, 0)",
        pointHoverBorderColor: "rgba(220, 220, 220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: pressure,
      },
    ],
  };

  function refreshChart() {
    dataline = {
      labels: timestamp,
      datasets: [
        {
          label: formatVariableName(y_field),
          lineTension: 0.3,
          backgroundColor: "rgba(225, 204,230, .3)",
          borderColor: "rgb(205, 130, 158)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgb(205, 130,1 58)",
          pointBackgroundColor: "rgb(255, 255, 255)",
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(220, 220, 220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: pressure,
        },
      ],
    };
    if (chartRef) {
      chartRef.$set({ data: dataline });
    }
  }
</script>

<CheckboxSelect
  dropdownLabel={"Y-Axis"}
  options={Array.from(fields)}
  bind:selected
/>

<label>
  Y Axis:
  <select bind:value={y_field} on:change={onLabelChange}>
    {#each Array.from(fields) as field}
      <option value={field}>{formatVariableName(field)}</option>
    {/each}
  </select>
</label>

<Line
  bind:this={chartRef}
  data={dataline}
  options={{
    responsive: true,
    maintainAspectRatio: false,
  }}
/>
