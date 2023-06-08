<script lang="ts">
  import "../../goldenlayout.css";
  import GoldenLayout from "svelte-golden-layout";
  import SmartNavBall from "$lib/components/smart/SmartNavBall.svelte";
  import GenericSbgGraph from "$lib/components/Panels/GenericSbgGraph.svelte";
  import {
    LayoutConfig,
    type ResolvedLayoutConfig,
    type VirtualLayout,
  } from "golden-layout";
  import RadioStatus from "$lib/components/radio/RadioStatus.svelte";
  import ErrorRate from "$lib/components/radio/ErrorRate.svelte";
  import MissedMessage from "$lib/components/radio/MissedMessage.svelte";

  const components = {
    SmartNavBall,
    ErrorRate,
    MissedMessage,
    RadioStatus,
    GenericSbgGraph,
  } as const;

  // LayoutConfig where componentType is keyof components
  // type LayoutCfg = LayoutConfig & {
  //   root: {
  //     type: "row" | "column";
  //     content: Array<{
  //       type: "component";
  //       componentType: keyof typeof components;
  //       componentState?: Record<string, any>;
  //     }>;
  //   };
  // };

  let goldenLayout: VirtualLayout;

  let layout: LayoutConfig = {
    settings: {
      showPopoutIcon: false,
    },
    root: {
      type: "row",
      content: [
        {
          type: "component",
          title: "NavBall",
          componentType: "SmartNavBall",
        },
        {
          title: "Pressure Chart",
          type: "component",
          componentType: "GenericSbgGraph",
          componentState: {
            selected: {
              sbg: ["pressure"],
            },
          },
        },
        {
          type: "component",
          title: "RadioStatus",
          componentType: "RadioStatus",
        },
        {
          type: "component",
          title: "MissedMessages",
          componentType: "MissedMessage",
        },
        {
          title: "Height Chart",
          type: "component",
          componentType: "GenericSbgGraph",
          componentState: {
            selected: {
              sbg: ["height"],
            },
          },
        },
        {
          type: "component",
          title: "ErrorRate",
          componentType: "ErrorRate",
        },
      ],
    },
  };

  function savePanels() {
    let saved = goldenLayout.saveLayout();
    localStorage.setItem("panels", JSON.stringify(saved));
  }

  function restorePanels() {
    const str = localStorage.getItem("panels");
    if (!str) return;
    const saved = JSON.parse(str) as ResolvedLayoutConfig;
    layout = LayoutConfig.fromResolved(saved);
  }

  let restart = 0;
</script>

<div class="w-full h-full flex flex-col p-1 bg-accent/25">
  <div>
    <button class="btn" on:click={savePanels}> Save Panels </button>
    <button class="btn" on:click={restorePanels}> Restore Panels </button>
  </div>

  <div class="flex-1">
    <!-- {#key restart} -->
    <GoldenLayout
      config={layout}
      let:componentType
      let:componentState
      bind:goldenLayout
    >
      <svelte:component this={components[componentType]} {...componentState} />
    </GoldenLayout>
  </div>
  <!-- {/key} -->
</div>
