<script lang="ts">
  import { onMount } from 'svelte';
  let metrics: any[] = [];
  let error: string | null = null;

  async function loadMetrics() {
    try {
      const res = await fetch('/radio/api');
      if (!res.ok) throw new Error(await res.text());
      metrics = await res.json();
    } catch (e: any) {
      error = e.message;
    }
  }

  onMount(() => {
    loadMetrics();
    const id = setInterval(loadMetrics, 5000);
    return () => clearInterval(id);
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Radio Metrics</h1>
  {#if error}
    <div class="alert alert-error mb-4">{error}</div>
  {/if}
  <table class="table table-compact w-full">
    <thead>
      <tr><th>Timestamp</th><th>RSSI</th><th>Packets Lost</th></tr>
    </thead>
    <tbody>
      {#each metrics as m}
        <tr>
          <td>{new Date(m.timestamp * 1000).toLocaleString()}</td>
          <td>{m.rssi ?? 'N/A'}</td>
          <td>{m.packets_lost ?? 0}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
