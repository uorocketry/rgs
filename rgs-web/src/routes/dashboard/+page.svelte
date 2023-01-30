<script lang="ts" type="module">
  import NavBall from "$lib/components/NavBall.svelte";
  import type { AbsoluteOrientationSensor } from "motion-sensors-polyfill";
  import * as THREE from "three";
  import { Euler } from "three";

  let rotation: THREE.Quaternion = new THREE.Quaternion();
  // @ts-ignore: Can't import constructor
  // let sensor: AbsoluteOrientationSensor = new AbsoluteOrientationSensor({
  //   frequency: 60,
  // });
  // sensor.addEventListener("reading", (e: any) => {
  //   if (e.target?.quaternion) {
  //     rotation.set(
  //       e.target.quaternion[0],
  //       e.target.quaternion[1],
  //       e.target.quaternion[2],
  //       e.target.quaternion[3]
  //     );
  //   }
  // });
  // sensor.start();

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
