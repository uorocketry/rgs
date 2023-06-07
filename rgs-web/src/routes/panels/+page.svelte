<script lang="ts">
  import "svelte-golden-layout/css/themes/goldenlayout-light-theme.css";
  import GoldenLayout from "svelte-golden-layout";
  import SmartNavBall from "$lib/components/smart/SmartNavBall.svelte";
  import GenericSbgGraph from "$lib/components/Panels/GenericSbgGraph.svelte";
  import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
  import type { LayoutConfig } from "golden-layout";
  import RadioStatus from "$lib/components/radio/RadioStatus.svelte";
  import ErrorRate from "$lib/components/radio/ErrorRate.svelte";
  import MissedMessage from "$lib/components/radio/MissedMessage.svelte";

  const components = {
    NavBall,
    ErrorRate,
    MissedMessage,
    RadioStatus,
  } as const;

  // LayoutConfig where componentType is keyof components
  type LayoutCfg = LayoutConfig & {
    root: {
      type: "row" | "column";
      content: Array<{
        type: "component";
        componentType: keyof typeof components;
        componentState?: Record<string, any>;
      }>;
    };
  };

  const layout: LayoutCfg = {
    root: {
      type: "row",
      content: [
        {
          type: "component",
          title: "SmartNavBall",
          componentType: "SmartNavBall",
        },
        {
          title: "Pressure Chart",
          type: "component",
          componentType: "RadioStatus",
        },
        {
          title: "Height Chart",
          type: "component",
          componentType: "MissedMessage",
        },
        {
          type: "component",
          componentType: "ErrorRate",
        },
      ],
    },
  };
</script>

<div class="w-full h-full">
  <GoldenLayout config={layout} let:componentType let:componentState>
    <svelte:component this={components[componentType]} {...componentState} />
  </GoldenLayout>
</div>
