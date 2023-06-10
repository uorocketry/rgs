<script lang="ts">
  import { sensor } from "$lib/stores";
  import { Euler, Quaternion } from "three";
  import NavBall from "../NavBall.svelte";
  import { onMount } from "svelte";
  import { MathUtils } from "three";
  import type { Sbg } from "$lib/common/bindings";

  let targetRotation = new Quaternion();
  let latestSbg: Sbg | undefined = undefined;
  targetRotation.set(0, 0, 0, 1);

  let eulerRepr = new Euler(0, 0, 0, "XYZ");
  eulerRepr.setFromQuaternion(targetRotation);

  onMount(() => {
    let s = sensor.subscribe((s) => {
      if (s?.data?.Sbg == null) return;
      latestSbg = s.data.Sbg;
      targetRotation.set(
        latestSbg.quant_x,
        latestSbg.quant_y,
        latestSbg.quant_z,
        latestSbg.quant_w
      );
      targetRotation = targetRotation;
      eulerRepr.setFromQuaternion(targetRotation);
      eulerRepr = eulerRepr;
    });
    return () => s();
  });
</script>

<div class="w-full h-full p-2 flex flex-col">
  <div>
    <div class=" flex flex-wrap">
      <button
        class="btn btn-sm flex-1"
        on:click={() =>
          navigator.clipboard.writeText(JSON.stringify(targetRotation))}
      >
        Copy Quat
      </button>

      <button
        class="btn btn-sm flex-1"
        on:click={() =>
          navigator.clipboard.writeText(JSON.stringify(eulerRepr.toArray()))}
      >
        Copy Euler
      </button>
    </div>

    <div class="flex">
      <span class="flex-1">Quat</span>
      <span class="flex-1">{targetRotation.x.toFixed(2)}</span>
      <span class="flex-1">{targetRotation.y.toFixed(2)}</span>
      <span class="flex-1">{targetRotation.z.toFixed(2)}</span>
      <span class="flex-1">{targetRotation.w.toFixed(2)}</span>
    </div>

    <!-- Pitch yaw row -->
    <div class="grid grid-cols-2">
      <span>Pitch</span>
      <span class="text-right"
        >{MathUtils.radToDeg(latestSbg?.pitch ?? 0).toFixed(2)}°</span
      >
      <span>Yaw</span>
      <span class="text-right"
        >{MathUtils.radToDeg(latestSbg?.yaw ?? 0).toFixed(2)}°</span
      >
      <span>Roll</span>
      <span class="text-right"
        >{MathUtils.radToDeg(latestSbg?.roll ?? 0).toFixed(2)}°</span
      >
    </div>
  </div>

  <div class="flex-1 overflow-hidden">
    <NavBall bind:targetRotation />
  </div>
</div>
