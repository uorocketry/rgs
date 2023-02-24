<script lang="ts">
  import { browser } from "$app/environment";
  import type { ProxyMessage, ZMQMessage } from "$lib/common/Message";
  import { onSocket } from "$lib/common/socket";
  import { onInterval } from "$lib/common/utils";
  import ZMQLogCard from "$lib/components/GenericLogCard.svelte";
  import VirtualList from "$lib/components/VirtualList.svelte";

  let logs: ZMQMessage[] = [];
  let recDts: number[] = [];
  let sizes: number[] = [];
  let start: number;
  let end: number;

  let avgClientDt = 0;
  let avgKbps = 0;
  if (browser) {
    onSocket("RocketData", (obj) => {
      logs = [...logs, obj];
      recDts = [...recDts, Date.now()];
      // Get size of object in bytes
      let objSize = new Blob([JSON.stringify(obj)]).size;
      sizes = [...sizes, objSize];
      // Limit to 1000 logs
      if (logs.length > 1000) {
        logs.shift();
        recDts.shift();
      }
    });

    // Every second
    onInterval(() => {
      let totalBytesTransferred = sizes.reduce((a, b) => a + b, 0);
      avgKbps = totalBytesTransferred / 1000;
      avgClientDt =
        recDts.reduce((a, b, i) => a + b - logs[i].timestamp, 0) / logs.length;
      sizes = [];
    }, 1000);
  }
</script>

<div class="p-2 h-full flex flex-col">
  <p>Showing {start}-{end} of {logs.length} rows</p>
  <p>
    Average Message DT @
    <!-- // recDts[i] - msg.timestamp -->
    ~{avgClientDt.toFixed(2)} ms
  </p>
  <p>
    Transfer Rate @ ~{avgKbps.toFixed(4)} KBps
  </p>

  <VirtualList items="{logs.reverse()}" let:item bind:start="{start}" bind:end="{end}">
    <div class="my-2">
      <ZMQLogCard msg="{item}" />
    </div>
  </VirtualList>
</div>
