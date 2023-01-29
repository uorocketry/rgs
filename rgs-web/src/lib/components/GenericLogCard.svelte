<script lang="ts">
  export let log: any;
</script>

<div class="card w=full gap-8 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">{log.type}</h2>
    {#each Object.entries(log.data) as [k, v]}
      <p>{k}: {Math.round(Number(v))}</p>
    {/each}
  </div>
</div>
