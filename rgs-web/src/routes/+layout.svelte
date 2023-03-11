<script lang="ts">
  // CSS
  import "../app.css";
  import "../leaflet.css";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import "golden-layout/dist/css/goldenlayout-base.css";
  import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";

  import Header from "$lib/components/Header.svelte";
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
