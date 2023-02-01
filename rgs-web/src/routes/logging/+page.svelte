<script lang="ts">
  import { ClientSocket } from "$lib/common/ClientSocket";
  import type { ZMQMessage } from "$lib/common/ZMQMessage";
  import ZMQLogCard from "$lib/components/GenericLogCard.svelte";
  import VirtualList from "$lib/components/VirtualList.svelte";

  let logs: ZMQMessage[] = [];
  let recDts: number[] = [];
  let start: number;
  let end: number;
  ClientSocket.on("zmq", (log) => {
    console.log(log);
    let obj: ZMQMessage = JSON.parse(log);
    logs = [...logs, obj];
    recDts = [...recDts, Date.now()];
  });
</script>

<div class="p-2 h-full flex flex-col">
  <p>Showing {start}-{end} of {logs.length} rows</p>
  <p>
    Average Server DT @
    {logs.reduce((a, b) => a + b.serverDelta, 0) / logs.length}
  </p>
  <p>
    Average Client DT @
    <!-- // recDts[i] - msg.timestamp -->
    {recDts.reduce((a, b, i) => a + b - logs[i].timestamp, 0) / logs.length}
  </p>

  <VirtualList items="{logs}" let:item bind:start="{start}" bind:end="{end}">
    <div class="my-2">
      <ZMQLogCard msg="{item}" />
    </div>
  </VirtualList>
</div>
