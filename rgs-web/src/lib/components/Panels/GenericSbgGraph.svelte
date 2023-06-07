<script lang="ts" type="module">
  import { onSocket } from "$lib/common/socket";
  import { formatVariableName } from "$lib/common/utils";

  import Scatter from "svelte-chartjs/src/Scatter.svelte";
  import CheckboxSelect from "../CheckboxSelect.svelte";
  import { collectionFields } from "$lib/common/dao";
  import { pb } from "$lib/stores";
  import type { ListResult, UnsubscribeFunc } from "pocketbase";

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

  let subscriptions: UnsubscribeFunc[] = [];
  let data = {};
  refreshChart();

  function randomCol(): string {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
  }

  async function refreshChart() {
    // Unsubscribe from previous collections
    for (const unsub of subscriptions) {
      unsub();
    }
    subscriptions = [];

    let dataSets = [];

    // Populate the datasets array with the data from the dataset map
    console.log("Refreshing chart");

    for (const entry of Object.entries(selected)) {
      if (entry[1].length > 0) {
        // Download the data
        const collection = pb.collection(entry[0]);

        // subscriptions.push(unsub);

        const data = await collection.getList(3, 20, {
          sort: "created",
          $autoCancel: false,
        });
        // dataValues.set(entry[0], data);

        // Crete line datasets
        const fields = entry[1];
        for (const key of fields) {
          let dataset = {
            label: formatVariableName(key),
            lineTension: 0.0,
            // FIXME: If you resize the window, the colors change
            borderColor: randomCol(),
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 2,
            data: [], // x, y pairs
          };
          dataSets.push(dataset);

          // Create subscriber
          let unsub = await collection.subscribe("*", (data) => {
            // Add the new data to the dataset
            dataset.data.push({
              x: Date.parse(data.record.created),
              y: data.record[key],
            });
          });
        }
      }
    }

    data = {
      datasets: dataSets,
    };
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

  $: if (selected) {
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
