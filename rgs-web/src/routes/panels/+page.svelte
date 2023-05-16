<script lang="ts">
  import "svelte-golden-layout/css/themes/goldenlayout-light-theme.css";
  import GoldenLayout from "svelte-golden-layout";
  import SmartNavBall from "$lib/components/smart/SmartNavBall.svelte";
  import GenericSbgGraph from "$lib/components/Panels/GenericSbgGraph.svelte";
  import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
  import type { LayoutConfig } from "golden-layout";

  const components = {
    SmartNavBall,
    GenericSbgGraph,
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
          componentType: "GenericSbgGraph",
          componentState: {
            selected: ["pressure"],
          },
        },
        {
          title: "Height Chart",
          type: "component",
          componentType: "GenericSbgGraph",
          componentState: {
            selected: ["height"],
          },
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
