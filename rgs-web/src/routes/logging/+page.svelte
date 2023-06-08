<script lang="ts">
  import { browser } from "$app/environment";
  import { onSocket, socket } from "$lib/common/socket";
  import { onInterval } from "$lib/common/utils";
  import GenericLogCard from "$lib/components/GenericLogCard.svelte";
  import VirtualList from "$lib/components/VirtualList.svelte";
  import type { Message } from "../../../../hydra_provider/bindings/Message";

  let reverseLogs: boolean = false;
  let logs: Message[] = [];
  let sizes: number[] = [];
  let start: number;
  let end: number;

  let clientToServerPing: number = 0;
  let serverToClientPing: number = 0;
  $: ping = clientToServerPing + serverToClientPing;

  const MAX_ROWS = 1000;
  const AVG_DT_WINDOW = 1000;
  const RUNNING_SLOW_THRESHOLD = 1000;

  let avgKbps = 0;
  if (browser) {
    onSocket("RocketMessage", (msg: Message) => {
      console.log("Received RocketMessage", msg);
      logs = [...logs, msg];
      // Get size of object in bytes
      let objSize = new Blob([JSON.stringify(msg)]).size;
      sizes = [...sizes, objSize];
      // Limit to 1000 logs
      if (logs.length > MAX_ROWS) {
        logs.shift();
      }
    });

    // Every second
    onInterval(() => {
      let totalBytesTransferred = sizes.reduce((a, b) => a + b, 0);
      avgKbps = totalBytesTransferred / AVG_DT_WINDOW;
      sizes = [];

      // Have another cancellable timeout if ping doesn't come back
      const pingGuard = setTimeout(() => {
        console.warn("Ping timeout");
        clientToServerPing = 99999999;
        serverToClientPing = 0;
      }, AVG_DT_WINDOW);

      let startMs = Date.now();
      socket?.emit("ping", (serverRcvT: number) => {
        clientToServerPing = serverRcvT - startMs;
        serverToClientPing = Date.now() - serverRcvT;
        clearTimeout(pingGuard);
      });
    }, AVG_DT_WINDOW);
  }
</script>

<div class="p-2 h-full flex flex-col">
  <div class="flex gap-4 pb-2">
    <div class="card bg-base-200 text-base-content p-4">
      <p>Showing {start}-{end} of {logs.length} rows</p>
      <p>
        Ping:
        <span class="{ping > RUNNING_SLOW_THRESHOLD ? 'text-error' : ''}">
          ~{ping} ms
        </span>
      </p>
      <p>
        Rx: ~{avgKbps.toFixed(4)} KBps
      </p>
    </div>
    <div
      class="flex flex-1 place-items-start card bg-base-200 text-base-content p-4"
    >
      <!-- Filter reverse -->
      <div
        class="tooltip tooltip-right"
        data-tip="{!reverseLogs
          ? 'Showing oldest first'
          : 'Showing newest first'}"
      >
        <label class="btn btn-square swap">
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" bind:checked="{reverseLogs}" />

          <!-- volume on icon -->
          <i class="swap-on fill-current fa-solid fa-arrow-down-a-z"></i>
          <!-- volume off icon -->
          <!-- <i class="swap-off fill-current fa-duotone fa-sort-up"></i> -->
          <i class="swap-off fa-solid fa-arrow-up-z-a"></i>
        </label>
      </div>
    </div>
  </div>

  <VirtualList
    items="{reverseLogs ? logs.slice().reverse() : logs}"
    let:item
    bind:start="{start}"
    bind:end="{end}"
  >
    <div class="my-2">
      <GenericLogCard msg="{item}" />
    </div>
  </VirtualList>
</div>
