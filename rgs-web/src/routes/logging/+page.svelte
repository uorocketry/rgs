<script lang="ts">
  import { ClientSocket } from "$lib/common/ClientSocket";

  let logs: any[] = [];

  ClientSocket.on("zmq", (log) => {
    let obj: any = JSON.parse(log);
    logs = [obj, ...logs];
  });
</script>

<div class="p-4 grid w-full gap-4 grid-auto-width">
  {#each logs as log}
    <div class="card w=full gap-8 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{log.type}</h2>
        <!-- For each entry in log data -->
        {#each Object.entries(log.data) as [k, v]}
          <p>{k}: {Math.round(Number(v))}</p>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .grid-auto-width {
    /* grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); */
  }
</style>
