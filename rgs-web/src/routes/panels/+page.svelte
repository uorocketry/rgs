<script lang="ts">
  import "svelte-golden-layout/css/themes/goldenlayout-light-theme.css";
  import Bonjour from "$lib/components/Panels/Bonjour.svelte";
  import Hello from "$lib/components/Panels/Hello.svelte";
  import GoldenLayout from "svelte-golden-layout";
  import { Euler } from "three";
  import { Quaternion } from "three";
  import NavBall from "$lib/components/NavBall.svelte";
  import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";

  const components = {
    Hello,
    Bonjour,
    NavBall,
  } as const;

  let rotation: THREE.Quaternion = new Quaternion();
  setInterval(() => {
    rotation.setFromEuler(
      new Euler(Math.random() * 7, Math.random() * 7, Math.random() * 7)
    );
  }, 1000);

  // LayoutConfig where componentType is keyof components
  type LayoutConfig = {
    root: {
      type: "row" | "column";
      content: Array<{
        type: "component";
        componentType: keyof typeof components;
        componentState?: Record<string, any>;
      }>;
    };
  };

  const layout: LayoutConfig = {
    root: {
      type: "row",
      content: [
        {
          type: "component",
          componentType: "NavBall",
          componentState: {
            targetRotation: rotation,
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
