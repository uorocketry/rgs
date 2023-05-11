<script lang="ts" type="module">
  import { onSocket } from "$lib/common/socket";
  import NavBall from "$lib/components/NavBall.svelte";
  import * as THREE from "three";
  import { Euler } from "three";
  import type { Message } from "../../../../hydra_provider/bindings/Message";
  import type { Data } from "../../../../hydra_provider/bindings/Data";
  import type { State } from "../../../../hydra_provider/bindings/State";
  import type { Sensor } from "../../../../hydra_provider/bindings/Sensor";

  let rotation: THREE.Quaternion = new THREE.Quaternion();

  onSocket("RocketMessage", (msg: Message) => {
    const data: Data = msg.data as { sensor: Sensor };
    if (data.sensor?.data?.Sbg == null) return;
    const sbg = data.sensor.data.Sbg;
    console.log("Updating NavBall Rotation", msg);
    rotation.setFromEuler(new Euler(sbg.quant_x, sbg.quant_y, sbg.quant_z));
  });
</script>

<div class="flex h-full items-center place-content-center">
  <div class="w-[48rem] h-[48rem]">
    <NavBall bind:targetRotation={rotation} />
  </div>
</div>
