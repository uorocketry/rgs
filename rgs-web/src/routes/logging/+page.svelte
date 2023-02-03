<script lang="ts">
  import { browser } from "$app/environment";
  import { onSocket } from "$lib/common/socket";
  import { onInterval } from "$lib/common/utils";
  import type { ZMQMessage } from "$lib/common/ZMQMessage";
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
    onSocket("zmq", (log: any) => {
      let obj: ZMQMessage = JSON.parse(log);
      logs = [...logs, obj];
      recDts = [...recDts, Date.now()];
      sizes = [...sizes, new TextEncoder().encode(log).length];
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

  <VirtualList items="{logs}" let:item bind:start="{start}" bind:end="{end}">
    <div class="my-2">
      <ZMQLogCard msg="{item}" />
    </div>
  </VirtualList>
</div>
