<script lang="ts" type="module">
  import NavBall from "$lib/components/NavBall.svelte";
  import * as THREE from "three";
  import { Euler } from "three";

  let rotation: THREE.Quaternion = new THREE.Quaternion();

  // Every seconds pick a random rotation
  setInterval(() => {
    rotation.setFromEuler(
      new Euler(Math.random() * 7, Math.random() * 7, Math.random() * 7)
    );
  }, 1000);
</script>

<div class="flex h-full items-center place-content-center">
  <div class="w-[48rem] h-[48rem]">
    <NavBall bind:targetRotation="{rotation}" />
  </div>
</div>
