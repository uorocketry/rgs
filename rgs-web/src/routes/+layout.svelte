<script lang="ts">
  // CSS
  import "../app.css";
  import "@fortawesome/fontawesome-free/css/all.min.css";

  import Header from "$lib/components/Header.svelte";
  import Stats from "stats.js";
  import { onMount } from "svelte";
  // Stats.js
  // TODO: Add a toggle to enable/disable this
  var stats = new Stats();
  stats.showPanel(2);
  onMount(() => {
    const el = document.getElementById("wrapper")?.appendChild(stats.dom);
    el.style = "position: fixed; right: 0px; bottom: 0px;";
  });

  function animate() {
    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
  setInterval(() => {
    stats.update();
  }, 1000);
</script>

<div id="wrapper" class="wrapper">
  <header>
    <Header />
  </header>

  <main class="overflow-auto">
    <slot />
  </main>
</div>

<style>
  .wrapper {
    position: fixed;
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 100%;
    min-height: 100%;
    margin: 0px auto;
    padding: 0px auto;
  }

  header {
    flex: 0 1 auto;
    z-index: 1;
  }

  main {
    /* Bunch of dots */
    --size: 0.5rem;
    background-image: radial-gradient(
      circle at center,
      hsla(var(--bc) / 0.2) 20%,
      transparent 25%
    );
    background-size: var(--size) var(--size);
    position: relative;
    bottom: 0;
    flex: 1 1 auto;
    z-index: 0;
  }
</style>
