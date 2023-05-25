<script lang="ts">
  import "svelte-golden-layout/css/themes/goldenlayout-light-theme.css";
  import Bonjour from "$lib/components/Panels/Bonjour.svelte";
  import Hello from "$lib/components/Panels/Hello.svelte";
  import GoldenLayout from "svelte-golden-layout";
  import NavBall from "$lib/components/NavBall.svelte";
  import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
  import { rotation } from "$lib/stores";
  import { get } from "svelte/store";
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
          title: "NavBall 1",
          componentType: "NavBall",
          componentState: {
            targetRotation: get(rotation),
          },
        },
        {
          type: "component",
          componentType: "RadioStatus",
        },
        {
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
  <GoldenLayout config="{layout}" let:componentType let:componentState>
    <svelte:component this="{components[componentType]}" {...componentState} />
  </GoldenLayout>
</div>
