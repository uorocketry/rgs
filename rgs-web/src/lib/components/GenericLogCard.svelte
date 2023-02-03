<script lang="ts">
  import type { Message } from "$lib/common/Message";

  export let msg: Message;
  let t = Date.now();
</script>

<div class="card bg-accent text-accent-content shadow-md">
  <div class="card-body">
    <h2 class="card-title">
      {msg.sender} | {msg.data.sensor ? "Sensor Data" : ""}
    </h2>
    {#if msg.data.sensor}
      <div class="card-body">
        {#each Object.entries(msg.data.sensor.data.Sbg ?? {}) as [k, v]}
          <div class="capitalize">
            <p>{k}: {JSON.stringify(v)}</p>
          </div>
        {/each}
      </div>
    {/if}

    {#if msg.data.state}
      <p>State</p>
    {/if}
  </div>
</div>
