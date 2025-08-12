<script lang="ts">
  import { onMount } from 'svelte';

  type Service = {
    name: string;
    status: 'running' | 'exited' | 'restarting' | 'unknown';
  };

  let services: Service[] = [];
  let loading = false;
  let errorMsg: string | null = null;
  let selectedService: string | null = null;
  let logText = '';
  let logFilter = '';
  let logTail = 500;
  let eventSource: EventSource | null = null;
  let streaming = false;
  let logEl: HTMLElement | null = null;

  async function fetchServices() {
    loading = true;
    errorMsg = null;
    try {
      const res = await fetch('/utils/services/api');
      if (!res.ok) throw new Error(await res.text());
      services = await res.json();
    } catch (err: any) {
      errorMsg = err.message ?? 'Failed to load services';
    } finally {
      loading = false;
    }
  }

  async function action(name: string, op: 'start' | 'stop' | 'restart') {
    loading = true;
    errorMsg = null;
    try {
      const verb = op === 'start' ? 'Start' : op === 'stop' ? 'Stop' : 'Restart';
      const proceed = typeof window !== 'undefined' ? window.confirm(`Confirm ${verb} for ${name}?`) : true;
      if (!proceed) return;
      const res = await fetch(`/utils/services/api?action=${op}&service=${encodeURIComponent(name)}`, { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());
      await fetchServices();
    } catch (err: any) {
      errorMsg = err.message ?? 'Operation failed';
    } finally {
      loading = false;
    }
  }

  onMount(fetchServices);

  async function fetchLogs() {
    if (!selectedService) return;
    try {
      const params = new URLSearchParams({ service: selectedService, tail: String(logTail) });
      if (logFilter) params.set('grep', logFilter);
      const res = await fetch(`/utils/services/logs/api?${params.toString()}`);
      logText = await res.text();
    } catch (e) {
      logText = 'Failed to fetch logs';
    }
  }

  function startStream() {
    if (!selectedService) return;
    stopStream();
    const params = new URLSearchParams({ service: selectedService, tail: String(logTail) });
    const url = `/utils/services/logs/stream?${params.toString()}`;
    eventSource = new EventSource(url);
    logText = '';
    streaming = true;
    eventSource.onmessage = (ev) => {
      const line = ev.data;
      if (logFilter) {
        try {
          const re = new RegExp(logFilter, 'i');
          if (!re.test(line)) return;
        } catch {}
      }
      logText += (logText ? '\n' : '') + line;
      queueMicrotask(() => {
        logEl?.scrollTo({ top: logEl.scrollHeight });
      });
    };
    eventSource.onerror = () => {
      stopStream();
    };
  }

  function stopStream() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    streaming = false;
  }

  function toggleStream() {
    streaming ? stopStream() : startStream();
  }
</script>

<div class="p-4 h-full flex flex-col">
  <h1 class="text-2xl font-bold mb-4">Service Manager</h1>

  {#if errorMsg}
    <div class="alert alert-error mb-4">{errorMsg}</div>
  {/if}

  <div class="grid grid-cols-2 gap-4 flex-1 min-h-0">
    <!-- Left: services table -->
    <div class="min-h-0 flex flex-col">
      <div class="overflow-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#if loading}
              <tr><td colspan="3">Loading...</td></tr>
            {:else if services.length === 0}
              <tr><td colspan="3">No services found</td></tr>
            {:else}
              {#each services as s}
                <tr>
                  <td>{s.name}</td>
                  <td>
                    {#if s.status === 'running'}
                      <span class="badge badge-success">running</span>
                    {:else if s.status === 'exited'}
                      <span class="badge">stopped</span>
                    {:else if s.status === 'restarting'}
                      <span class="badge badge-warning">restarting</span>
                    {:else}
                      <span class="badge badge-ghost">unknown</span>
                    {/if}
                  </td>
                  <td class="text-right space-x-2">
                    <button class="btn btn-xs" on:click={() => action(s.name, 'start')}>Start</button>
                    <button class="btn btn-xs" on:click={() => action(s.name, 'stop')}>Stop</button>
                    <button class="btn btn-xs" on:click={() => action(s.name, 'restart')}>Restart</button>
                    <button class="btn btn-xs" on:click={() => { selectedService = s.name; startStream(); }}>Logs</button>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>

      <div class="mt-4">
        <button class="btn" on:click={fetchServices} disabled={loading}>Refresh</button>
      </div>
    </div>

    <!-- Right: logs viewer -->
    <div class="flex flex-col gap-2 min-h-0">
      <div class="flex items-center gap-2">
        <select class="select select-sm" bind:value={selectedService}>
          <option value="" disabled selected>Select service</option>
          {#each services as s}
            <option value={s.name}>{s.name}</option>
          {/each}
        </select>
        <input class="input input-sm input-bordered" placeholder="filter (regex)" bind:value={logFilter} />
        <input class="input input-sm input-bordered w-24" type="number" min="50" max="5000" step="50" bind:value={logTail} />
        <button class="btn btn-sm" on:click={fetchLogs} disabled={!selectedService}>Get logs</button>
        <button class="btn btn-sm {streaming ? 'btn-error' : 'btn-success'}" on:click={toggleStream} disabled={!selectedService}>
          {streaming ? 'Stop' : 'Start stream'}
        </button>
      </div>
      <pre id="log-output" bind:this={logEl} class="border rounded p-2 bg-base-200 overflow-auto whitespace-pre-wrap flex-1 min-h-0">{logText}</pre>
    </div>
  </div>
</div>


