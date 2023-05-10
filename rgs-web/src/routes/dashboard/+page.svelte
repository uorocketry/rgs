<script lang="ts" type="module">
  import { onSocket } from "$lib/common/socket";
  import NavBall from "$lib/components/NavBall.svelte";
  import * as THREE from "three";
  import { Euler } from "three";

  let rotation: THREE.Quaternion = new THREE.Quaternion();

  onSocket("RocketData", (packet) => {
    // smh smh smh
    if (packet.RocketData?.data?.sensor?.data?.Sbg == null) return;
    console.log("Updating NavBall Rotation", packet);
    rotation.setFromEuler(
      new Euler(
        packet.RocketData.data.sensor.data.Sbg?.quant_x,
        packet.RocketData.data.sensor.data.Sbg?.quant_y,
        packet.RocketData.data.sensor.data.Sbg?.quant_z
      )
    );
  });
</script>

<div class="flex h-full items-center place-content-center">
  <div class="w-[48rem] h-[48rem]">
    <NavBall bind:targetRotation={rotation} />
  </div>
</div>
