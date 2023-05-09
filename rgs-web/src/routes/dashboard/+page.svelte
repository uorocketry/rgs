<script lang="ts" type="module">
  import { onSocket } from "$lib/common/socket";
  import NavBall from "$lib/components/NavBall.svelte";
  import * as THREE from "three";
  import { Euler } from "three";

  let rotation: THREE.Quaternion = new THREE.Quaternion();

  // Every seconds pick a random rotation
  // setInterval(() => {
  //   rotation.setFromEuler(
  //     new Euler(Math.random() * 7, Math.random() * 7, Math.random() * 7)
  //   );
  // }, 1000);

  onSocket("RocketData", (packet) => {
    // console.log(packet.RocketData);
    if (packet.RocketData.data.sensor === undefined) return;
    if (packet.RocketData.data.sensor.data.Sbg === undefined) return;

    // console.log(packet.RocketData.data.sensor.data.Sbg);
    console.log({
      pitch: packet.RocketData.data.sensor.data.Sbg?.pitch,
      roll: packet.RocketData.data.sensor.data.Sbg?.roll,
      yaw: packet.RocketData.data.sensor.data.Sbg?.yaw,
    });
    const toDeg = (rad: number) => (rad * 180) / Math.PI;
    rotation.setFromEuler(
      new Euler(
        toDeg(packet.RocketData.data.sensor.data.Sbg?.pitch),
        toDeg(packet.RocketData.data.sensor.data.Sbg?.roll),
        toDeg(packet.RocketData.data.sensor.data.Sbg?.yaw)
      )
    );
  });
</script>

<div class="flex h-full items-center place-content-center">
  <div class="w-[48rem] h-[48rem]">
    <NavBall bind:targetRotation={rotation} />
  </div>
</div>
