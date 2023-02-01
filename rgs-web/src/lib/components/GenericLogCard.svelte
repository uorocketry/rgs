<script lang="ts">
  import type { ZMQMessage } from "$lib/common/ZMQMessage";

  export let msg: ZMQMessage;
  let t = Date.now();

  setInterval(() => {
    t = Date.now();
  }, 1000);
</script>

<div>T: {t}</div>
<div class="card w=full gap-8 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      {msg.sender}: Recieved @ {msg.timestamp}: Delay: {msg.timestamp}
    </h2>
    {#each Object.entries(msg.data) as [k, v]}
      <p>{k}: {JSON.stringify(v)}</p>
    {/each}
  </div>
</div>
