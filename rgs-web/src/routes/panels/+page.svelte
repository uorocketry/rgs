<script lang="ts">
  import "svelte-golden-layout/css/themes/goldenlayout-light-theme.css";
  import Bonjour from "$lib/components/Panels/Bonjour.svelte";
  import Hello from "$lib/components/Panels/Hello.svelte";
  import GoldenLayout from "svelte-golden-layout";
  import { Euler } from "three";
  import { Quaternion } from "three";
  import NavBall from "$lib/components/NavBall.svelte";
  import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
  import { rotation } from "$lib/stores";
  import { get } from "svelte/store";
  import type { LayoutConfig } from "golden-layout";

  const components = {
    Hello,
    Bonjour,
    NavBall,
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
          title: "NavBall 2",
          componentType: "NavBall",
          componentState: {
            targetRotation: get(rotation),
          },
        },
        {
          type: "component",
          componentType: "Hello",
        },
        {
          type: "component",
          componentType: "Bonjour",
        },
      ],
    },
  };
</script>

<div class="layout-container">
  <GoldenLayout config="{layout}" let:componentType let:componentState>
    <svelte:component this="{components[componentType]}" {...componentState} />
  </GoldenLayout>
</div>

<style>
  .layout-container {
    width: 800px;
    height: 600px;

    margin: 150px auto;
    border: 1px solid black;
  }
</style>
