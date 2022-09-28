<script lang="ts">
  import { ClientSocket } from "$lib/common/ClientSocket";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let endpoint: string = ClientSocket.getEndpoint();
  let socketOK = ClientSocket.connected;
  let endpointInput: HTMLInputElement;
  onMount(() => endpointInput.focus());
</script>

<div class="form-control  max-w-xs">
  <label for="endpoint" class="label"> Custom Endpoint </label>
  <input
    id="endpoint"
    type="text"
    bind:this={endpointInput}
    bind:value={endpoint}
    on:input={() => {
      if (endpoint == "") {
        endpoint = ClientSocket.DEFAULT_ENDPOINT;
      }
      if (browser) {
        localStorage.setItem("endpoint", endpoint);
      }
      ClientSocket.setEndpoint(endpoint);
    }}
    placeholder={ClientSocket.DEFAULT_ENDPOINT}
    class="input input-bordered"
    class:input-error={!$socketOK}
  />
</div>
