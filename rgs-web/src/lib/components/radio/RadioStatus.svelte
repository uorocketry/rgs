<script lang="ts">
  import type { LinkStatus } from "../../../../../hydra_provider/bindings/LinkStatus";
  import { onSocket, socket } from "$lib/common/socket";

  let radio_msg: LinkStatus[] = [];

  onSocket("LinkStatus", (msg: LinkStatus) => {
    radio_msg = [...radio_msg, msg];
  });

  $: current_msg = radio_msg[radio_msg.length - 1];
</script>

<div class="w-full h-full overflow-x-auto">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="rounded-none">Field</th>
        <th class="rounded-none">Value</th>
      </tr>
    </thead>
    <tbody>
      <!-- For each key val of current msg -->
      {#if current_msg}
        {#each Object.entries(current_msg) as [key, val]}
          <tr class="hover">
            <th class="text-left">{key}</th>
            <td class="text-right">{val}</td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td class="text-center" colspan="2">No data</td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
