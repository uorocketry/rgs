<script lang="ts">
  import { ClientSocket } from "$lib/common/ClientSocket";
  import GenericLogCard from "$lib/components/GenericLogCard.svelte";
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import { onMount } from "svelte";
  let logs: any[] = [];
  let start: number;
  let end: number;
  ClientSocket.on("zmq", (log) => {
    let obj: any = JSON.parse(log);
    logs = [...logs, obj];
  });
</script>

<div class="p-2 h-full flex flex-col">
  <p>Showing {start}-{end} of {logs.length} rows</p>

  <VirtualList items={logs} let:item bind:start bind:end>
    <div class="my-2">
      <GenericLogCard log={item} />
    </div>
  </VirtualList>
</div>
