<script lang="ts">
  import type { Message } from "$lib/common/Message";

  export let msg: Message;
  let t = Date.now();
</script>

<div class="card w=full gap-8 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      {msg.sender}
    </h2>
    <p>Client DT @ {t - msg.timestamp}</p>
    {#each Object.entries(msg.data) as [k, v]}
      <p>{k}: {JSON.stringify(v)}</p>
    {/each}
  </div>
</div>
