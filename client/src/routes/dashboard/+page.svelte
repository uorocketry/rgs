<script defer lang="ts" type="module">
  import {
    onInterval,
    onSocket,
    onSocketChange,
    onThemeChange,
  } from "$lib/common/utils";

  import { ClientSocket } from "$lib/common/ClientSocket";
  import { onMount } from "svelte";
  import { defaultChartOptions } from "$lib/common/chartUtils";
  import { Chart } from "chart.js";

  ClientSocket.socket.emit("meta");
  let subscribedTo: any[] = [];
  let metaIter = ClientSocket.data.get("meta");
  let labels: string[] = [];
  if (metaIter) {
    labels = Array.from(metaIter.values());
  }

  onSocket("meta", (_) => {
    let metaIter = ClientSocket.data.get("meta")?.values();
    if (metaIter) {
      labels = Array.from(metaIter);
    }
  });

  onSocketChange(() => {
    labels = [];
    ClientSocket.socket.emit("meta");
  });

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let chart: Chart;

  function setupGraph() {
    const options = defaultChartOptions();
    // scatter line graph
    chart = new Chart(ctx, {
      type: "scatter",

      data: {
        datasets: [],
      },
      options: options,
    });
  }

  onMount(() => {
    if (canvas) {
      let parent = canvas.parentElement;
      let n_ctx = canvas.getContext("2d");

      if (!n_ctx) {
        console.error("Could not get context");
        return;
      }
      if (!parent) {
        console.error("Could not get parent");
        return;
      }

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      ctx = n_ctx;
      setupGraph();
    }
  });

  onThemeChange(() => {
    if (chart) {
      chart.options = defaultChartOptions();
      chart.update();
    }
  });

  // On window resize, resize the canvas
  window.addEventListener("resize", () => {
    if (canvas) {
      let parent = canvas.parentElement;
      if (!parent) {
        console.error("Could not get parent");
        return;
      }
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      chart.resize();
    }
  });

  onSocket("put", (key, timestamp, value) => {
    if (chart) {
      // Find the dataset with the matching key
      let dataset = chart.data.datasets.find(
        (dataset) => dataset.label === key
      );
      if (dataset) {
        dataset.data.push({
          x: timestamp,
          y: value,
        });
      }
    }
  });

  onInterval(() => {
    if (chart) {
      chart.update();
    }
  }, 200);

  // Handle subscribed data
  $: {
    if (chart) {
      // update charts with subcribedTo
      let subscribedNotIn = subscribedTo.filter((label) => {
        return (
          chart.data.datasets.findIndex(
            (dataset) => dataset.label === label
          ) === -1
        );
      });
      subscribedNotIn.forEach((label) => {
        chart.data.datasets.push({
          label,
          data: [],
          showLine: true,
        });
      });

      // remove charts that are not subscribed to from chart
      let datasetNotSubscribedTo = chart.data.datasets.filter((dataset) => {
        return (
          subscribedTo.findIndex((label) => label === dataset.label) === -1
        );
      });

      datasetNotSubscribedTo.forEach((dataset) => {
        chart.data.datasets.splice(chart.data.datasets.indexOf(dataset), 1);
      });
    }
  }

  onresize = () => {
    if (canvas) {
      let parent = canvas.parentElement;
      if (!parent) {
        console.error("Could not get parent");
        return;
      }
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      // chart.resize(parent.clientHeight, parent.clientWidth);
      chart.resize();
      console.log("resize");
    }
  };
</script>

<svelte:window />

<div class="flex">
  <ul class="h-screen menu bg-base-200 p-1">
    <!-- Maybe something else here -->
    <li />
    <li class="menu-title"><span>Data fields</span></li>
    <!-- Foreach svelte labels -->
    <!-- Horizontal list -->
    <li class="grid " style="grid-template-columns: auto auto;">
      {#each labels as label}
        <span>{label}</span>

        <label class="text-xl swap swap-rotate">
          <input
            type="checkbox"
            checked={subscribedTo.includes(label)}
            on:change={() => {
              // If not subscribed, subscribe
              if (!subscribedTo.includes(label)) {
                console.log("subscribing to", label);
                subscribedTo.push(label);
                ClientSocket.socket.emit("sub", label);
              } else {
                // If subscribed, unsubscribe
                console.log("unsub", label);
                subscribedTo = subscribedTo.filter((l) => l !== label);
                ClientSocket.socket.emit("unsub", label);
              }
              subscribedTo = subscribedTo;
            }}
          />
          <i class="swap-on fa-solid fa-eye text-green-500 " />
          <i class="swap-off fa-solid fa-eye-slash text-red-500" />
        </label>
      {/each}
    </li>
  </ul>
  <div class="chart-container">
    <canvas id="chart" bind:this={canvas} />
  </div>
</div>

<style>
  .chart-container {
    position: relative;
    margin: auto;
    height: 80vh;
    width: 80vw;
  }
</style>
