<script lang="ts">
  import type { Message } from "$lib/common/bindings";

  export let msg: Message;
  let t = Date.now();

  function formatData(data: any) {
    // let canBeNumber = parseFloat(data);

    if (1) {
      // If not integer, return as float with fixed 8 decimal places
      if (data % 1 !== 0) {
        let dataString = data.toString();
        let decimalIndex = dataString.indexOf(".");
        let decimalPlaces = dataString.length - decimalIndex - 1;
        // return `${data.toFixed(8)}`;
        // TODO: Fix me
        return data;
      }
    }
    return data;
  }

  let timeDtFormat = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
    style: "long",
  });

  let timeFormat = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
</script>

<div class="card card-compact bg-base-200 shadow-xl">
  <div class="card-body gap-0 !p-2">
    <div class="card-title">
      {msg.sender}
      <div class="flex-1 text-end">
        <p class="text-sm">
          {timeFormat.format(1)}
        </p>
      </div>
    </div>
    <table class="table table-compact">
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
                  <td class="p-0 m-0">
                    <table>
                      {#each Object.entries(componentData) as [sensorName, sensorData]}
                        <tr>
                          {#if sensorData}
                            <td>{sensorName}</td>
                            <td class="p-0 m-0">
                              <table>
                                {#each Object.entries(sensorData) as [dataKey, dataValue]}
                                  <tr>
                                    <td>{dataKey}</td>
                                    {#if dataValue}
                                      <td class="p-0 m-0">
                                        <table>
                                          {#each Object.entries(dataValue) as [subKey, subValue]}
                                            <tr>
                                              <td>{subKey}</td>
                                              <td>{formatData(subValue)}</td>
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
