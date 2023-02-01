<script lang="ts">
  import { ClientSocket } from "$lib/common/ClientSocket";
  import type { ZMQMessage } from "$lib/common/ZMQMessage";
  import ZMQLogCard from "$lib/components/GenericLogCard.svelte";
  import VirtualList from "$lib/components/VirtualList.svelte";

  let logs: ZMQMessage[] = [];
  let start: number;
  let end: number;
  ClientSocket.on("zmq", (log) => {
    let obj: ZMQMessage = JSON.parse(log);
    logs = [...logs, obj];
  });
</script>

<div class="p-2 h-full flex flex-col">
  <p>Showing {start}-{end} of {logs.length} rows</p>

  <VirtualList items={logs} let:item bind:start bind:end>
    <div class="my-2">
      <ZMQLogCard msg={item} />
    </div>
  </VirtualList>
</div>
