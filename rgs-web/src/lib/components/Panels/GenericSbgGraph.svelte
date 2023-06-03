<script lang="ts" type="module">
  import { onSocket } from "$lib/common/socket";
  import { formatVariableName } from "$lib/common/utils";

  import Scatter from "svelte-chartjs/src/Scatter.svelte";
  import CheckboxSelect from "../CheckboxSelect.svelte";
  import { collectionFields } from "$lib/common/dao";
  import { pb } from "$lib/stores";
  import type { ListResult } from "pocketbase";

  export let selected: { [key: string]: string[] } = {};
  let chartRef: Scatter;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    showLine: true,
    // Update x axis to convert timestamp to date
    scales: {
      x: {
        ticks: {
          callback: function (value: number) {
            let date = new Date(Number(value));
            return date.toLocaleTimeString();
          },
        },
      },
    },
  };

  let data = {};
  refreshChart();

  function randomCol(): string {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
  }

  async function refreshChart() {
    let dataValues: Map<string, ListResult<any>> = new Map();
    let dataSets = [];

    // Populate the datasets array with the data from the dataset map
    console.log("Refreshing chart");

    for (const entry of Object.entries(selected)) {
      if (entry[1].length > 0) {
        // Download the data
        const collection = pb.collection(entry[0]);
        const data = await collection.getList(3, 20, {
          sort: "created",
          $cancelKey: entry + "chart",
        });
        dataValues.set(entry[0], data);

        // Crete line datasets
        const fields = entry[1];

        for (const key of fields) {
          const values = data.items.map((item) => {
            return {
              x: Date.parse(item.created),
              y: item[key],
            };
          });
          dataSets.push({
            label: formatVariableName(key),
            lineTension: 0.0,
            // FIXME: If you resize the window, the colors change
            borderColor: randomCol(),
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 2,
            data: values,
          });
        }
      }
    }

    data = {
      datasets: dataSets,
    };
    console.log(data);
    if (chartRef) {
      chartRef.$set({ data: data });
      console.log("Chart refreshed");
    }
  }

  let clientWidth = 0;
  let clientHeight = 0;

  // HACK To force restart of the chart component
  let restart = [{}];
  let restartCount = 0;

  $: if (chartRef) {
    clientHeight;
    clientWidth;
    restartCount += 1;
    if (restartCount % 2 == 0) {
      console.log("Resizing");
      restart = [{}];
    }
  }

  $: {
    console.log(Object.entries(selected));
    refreshChart();
  }

  // Update collection entries
  let collectionsEntries: { key: string; value: string[] }[] = [];
  collectionFields.subscribe((fields) => {
    console.log("Updating collections entries");
    collectionsEntries = [];
    for (const [key, value] of fields.entries()) {
      collectionsEntries.push({ key, value });
    }
    collectionsEntries = [...collectionsEntries];
  });
</script>

<div class="w-full h-full flex flex-col" bind:clientHeight bind:clientWidth>
  <div class="">
    <!-- TODO: Checkbox not working(???) -->
    {#each collectionsEntries as collection}
      <CheckboxSelect
        dropdownLabel={formatVariableName(collection.key)}
        options={collection.value ?? []}
        bind:selected={selected[collection.key]}
      />
    {/each}
  </div>

  <div class="flex-1">
    {#each restart as key (key)}
      <Scatter bind:this={chartRef} bind:data {options} />
    {/each}
  </div>
</div>
