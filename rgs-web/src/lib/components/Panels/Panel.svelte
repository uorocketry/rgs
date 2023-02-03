<script lang="ts">
  import type { ComponentType } from "svelte";

  export let tabs: [string, ComponentType][] = [];
  export let activeTab: string = "";

  if (tabs.length > 0 && activeTab === "") {
    activeTab = tabs[0][0];
  }

  function onDragStart(e: DragEvent, panelIndex: number) {
    let panel = tabs[panelIndex];
    console.log("Dragging: ", panel[0]);
    // e.dataTransfer.setData("text/plain", e.target.textContent);
  }

  let activeComponent: ComponentType | null = null;

  $: {
    activeComponent = tabs.find((t) => t[0] === activeTab)?.[1] ?? null;
  }
</script>

<!-- Wrap slot into a panel -->
<div class="flex w-full h-full flex-col flex-1 p-1">
  <!-- Tab -->
  <div class="pb-1 flex gap-2 overflow-auto">
    {#each tabs as tab, i}
      <button
        class="btn btn-outline btn-xs "
        draggable="true"
        on:dragstart="{(e) => onDragStart(e, i)}"
        on:drop="{(e) => console.log('Drag end', e)}"
        on:click="{() => (activeTab = tab[0])}"
      >
        {tab[0]}
      </button>
    {/each}
  </div>
  <!-- Content -->
  <div
    on:drop="{(e) => console.log('Dropped', e)}"
    class="flex-1 panel-container "
  >
    <svelte:component this="{activeComponent}" />
  </div>
</div>

<style>
  .panel-container {
    overflow: auto;
  }
</style>
