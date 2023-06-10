<script lang="ts">
  import "../../goldenlayout.css";
  import GoldenLayout from "svelte-golden-layout";
  import type { VirtualLayout } from "golden-layout";
  import {
    layoutComponents,
    layoutComponentsString,
    layoutConfig,
    virtualLayout,
  } from "$lib/common/layoutStore";

  let goldenLayout: VirtualLayout;

  $: {
    virtualLayout.set(goldenLayout);
  }
</script>

<div class="w-full h-full flex flex-col p-1 bg-accent/25">
  <div class="flex-1">
    <GoldenLayout
      config={$layoutConfig}
      let:componentType
      let:componentState
      bind:goldenLayout
    >
      <svelte:component
        this={layoutComponents[componentType]}
        {...componentState}
      />
    </GoldenLayout>
  </div>
</div>
