<script lang="ts">
  import type { LayoutConfig } from "golden-layout";
  import "svelte-golden-layout/css/themes/goldenlayout-light-theme.css";
  import Bonjour from "$lib/components/Panels/Bonjour.svelte";
  import Hello from "$lib/components/Panels/Hello.svelte";
  import GoldenLayout from "svelte-golden-layout";
  import { Euler } from "three";
  import { Quaternion } from "three";
  import NavBall from "$lib/components/NavBall.svelte";

  const components = { Bonjour, Hello, NavBall };
  let rotation: THREE.Quaternion = new Quaternion();
  setInterval(() => {
    rotation.setFromEuler(
      new Euler(Math.random() * 7, Math.random() * 7, Math.random() * 7)
    );
  }, 1000);
  //  <NavBall bind:targetRotation="{rotation}" />

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
