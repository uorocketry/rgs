<script lang="ts">
  import "../../goldenlayout.css";
  // import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
  import GoldenLayout from "svelte-golden-layout";
  import SmartNavBall from "$lib/components/smart/SmartNavBall.svelte";
  import GenericSbgGraph from "$lib/components/Panels/GenericSbgGraph.svelte";
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
    settings: {
      showPopoutIcon: false,
    },
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
          componentType: "GenericSbgGraph",
          componentState: {
            selected: {
              sbg: ["pressure"],
            },
          },
          componentType: "RadioStatus",
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

<!--  background: hsl(var(--a));
  opacity: 0.25; -->

<div class="w-full h-full p-1 bg-accent/25">
  <GoldenLayout config={layout} let:componentType let:componentState>
    <svelte:component this={components[componentType]} {...componentState} />
  </GoldenLayout>
</div>
