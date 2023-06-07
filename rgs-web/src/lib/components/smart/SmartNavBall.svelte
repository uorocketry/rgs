<script>
  import { sensor } from "$lib/stores";
  import { Quaternion } from "three";
  import NavBall from "../NavBall.svelte";
  import { onMount } from "svelte";

  let targetRotation = new Quaternion();

  onMount(() => {
    let s = sensor.subscribe((s) => {
      if (s?.data?.Sbg == null) return;
      const sbg = s.data.Sbg;
      targetRotation.set(sbg.quant_x, sbg.quant_y, sbg.quant_z, sbg.quant_w);
    });
    return () => s();
  });
</script>

<NavBall bind:targetRotation />
