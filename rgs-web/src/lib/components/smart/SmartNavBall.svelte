<script>
  import { sensor } from "$lib/stores";
  import { Euler, Quaternion } from "three";
  import NavBall from "../NavBall.svelte";
  import { onMount } from "svelte";
  import { MathUtils } from "three";

  let targetRotation = new Quaternion();
  targetRotation.set(0, 0, 0, 1);

  let eulerRepr = new Euler(0, 0, 0, "XYZ");
  eulerRepr.setFromQuaternion(targetRotation);

  onMount(() => {
    let s = sensor.subscribe((s) => {
      if (s?.data?.Sbg == null) return;
      const sbg = s.data.Sbg;
      targetRotation.set(sbg.quant_x, sbg.quant_y, sbg.quant_z, sbg.quant_w);
      console.log(targetRotation);
      targetRotation = targetRotation;
      eulerRepr.setFromQuaternion(targetRotation);
      eulerRepr = eulerRepr;
    });
    return () => s();
  });
</script>

<div class="w-full h-full p-2 flex flex-col">
  <!-- On clip copy quat to clipboard -->
  <div class="w-full flex flex-wrap">
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

  <div class="flex w-full">
    <span class="flex-1">Quat</span>
    <span class="flex-1">{targetRotation.x.toFixed(2)}</span>
    <span class="flex-1">{targetRotation.y.toFixed(2)}</span>
    <span class="flex-1">{targetRotation.z.toFixed(2)}</span>
    <span class="flex-1">{targetRotation.w.toFixed(2)}</span>
  </div>

  <!-- Pitch yaw row -->
  <div class="grid grid-cols-2">
    <span>Pitch</span>
    <span class="text-right">{MathUtils.radToDeg(eulerRepr.x).toFixed(2)}°</span
    >
    <span>Yaw</span>
    <span class="text-right">{MathUtils.radToDeg(eulerRepr.y).toFixed(2)}°</span
    >
    <span>Roll</span>
    <span class="text-right">{MathUtils.radToDeg(eulerRepr.z).toFixed(2)}°</span
    >
  </div>

  <NavBall bind:targetRotation />
</div>
