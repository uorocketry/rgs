<script lang="ts">
  import type { ZMQMessage } from "$lib/common/ZMQMessage";
    import { json } from "@sveltejs/kit";
    import { each } from "svelte/internal";

  export let msg: ZMQMessage;
  let t = Date.now();
</script>

<div class="card w=full gap-8 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      {msg.sender}
    </h2>
    <p>Server DT @ {msg.serverDelta}</p>
    <p>Client DT @ {t - msg.timestamp}</p>
    <table class="table w-full">
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.entries(msg) as [key, value]}
          {#if value && key !== "timestamp" && key !== "sender"}
            {#each Object.entries(value) as [componentId, componentData]}
              {#if componentData}
                <tr>
                  <td>{componentId}</td>
                  <td>
                    <table>
                      {#each Object.entries(componentData) as [sensorName, sensorData]}
                        <tr>
                          {#if sensorData}
                            <td>{sensorName}</td>
                            <td>
                              <table>
                                {#each Object.entries(sensorData) as [dataKey, dataValue]}
                                  <tr>
                                    <td>{dataKey}</td>
                                    {#if dataValue}
                                      <td>
                                        <table>
                                          {#each Object.entries(dataValue) as [subKey, subValue]}
                                            <tr>
                                              <td>{subKey}</td>
                                              <td>{subValue}</td>
                                            </tr>
                                          {/each}
                                        </table>
                                      </td>
                                    {/if}
                                  </tr>
                                {/each}
                              </table>
                            </td>
                          {:else}
                            <td>{sensorName}</td>
                            <td>{sensorData}</td>
                          {/if}
                        </tr>
                      {/each}
                    </table>
                  </td>
                </tr>
              {:else}
                <tr>
                  <td>{key} - {componentId}</td>
                  <td>{componentId}</td>
                </tr>
              {/if}
            {/each}
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</div>
