<script lang="ts" type="module">
  import { onSocket } from "$lib/common/socket";
  import { formatVariableName, onInterval } from "$lib/common/utils";

  import type { Message } from "../../../../../hydra_provider/bindings/Message";
  import type { Data } from "../../../../../hydra_provider/bindings/Data";
  import type { Sensor } from "../../../../../hydra_provider/bindings/Sensor";
  import Scatter from "svelte-chartjs/src/Scatter.svelte";
  import CheckboxSelect from "../CheckboxSelect.svelte";

  let timestamp: bigint[] = [];
  export let selected: string[] = [];
  // String to tuple array (timestamp, value)
  let dataSet = new Map<string, [bigint, number][]>();
  let chartRef: Scatter;

  // All possible fields (generated from the first message)
  let fields = new Set<string>(selected);

  $: {
    if (selected.length > 0) {
      onLabelChange();
    }
  }

  function onLabelChange() {
    timestamp = [];

    if (chartRef) {
      refreshChart();
    }
  }

  onSocket("RocketMessage", (msg: Message) => {
    const data: Data = msg.data as { sensor: Sensor };
    if (data.sensor?.data?.Sbg == null) return;
    const sbg = data.sensor.data.Sbg;

    // For all selected fields, add the data to the dataset
    let newFieldCreated = false;
    fields.forEach((field) => {
      if (dataSet.has(field)) {
        dataSet.get(field)?.push([msg.timestamp, (sbg as any)[field]]);
      } else {
        dataSet.set(field, [[msg.timestamp, (sbg as any)[field]]]);
        newFieldCreated = true;
      }
    });
    if (newFieldCreated) {
      refreshChart();
    }

    timestamp.push(msg.timestamp);

    const sbgFields = Object.keys(sbg);
    fields = new Set([...fields, ...sbgFields]);

    if (chartRef) {
      chartRef.$set({ data: dataline });
    }
  });

  let dataline = {};
  refreshChart();

  function randomCol(): string {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
  }

  function refreshChart() {
    let ds: any[] = [];
    // Populate the datasets array with the data from the dataset map
    dataSet.forEach((value, key) => {
      if (!selected.includes(key)) return;
      ds.push({
        label: formatVariableName(key),
        lineTension: 0.3,
        // Funny enough, if you resize the window, the colors change
        borderColor: randomCol(),
        pointBorderWidth: 10,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 2,
        data: value,
      });
    });

    dataline = {
      labels: timestamp,
      datasets: ds,
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

<Scatter
  bind:this={chartRef}
  bind:data={dataline}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    showLine: true,
  }}
/>
