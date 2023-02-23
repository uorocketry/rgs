<!-- Custom panels and window dragging -->
<script lang="ts">
  import Bonjour from "$lib/components/Panels/Bonjour.svelte";
  import Hello from "$lib/components/Panels/Hello.svelte";
  import Panel from "$lib/components/Panels/Panel.svelte";

  const tabs = [["hello", Hello]];
</script>

<div class="hsplit w-full h-full bg-gray-700">
  <div class="vsplit">
    <Panel tabs="{tabs}" />
    <span>B</span>
  </div>

  <div class="hsplit">
    <span>C</span>
    <span>D</span>
  </div>
</div>

<style>
  .hsplit {
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: auto;
  }

  .vsplit {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
  }

  .hsplit > * {
    flex: 1;
    border: 1px solid black;
    border-radius: 0.5rem;
    padding: 0.25rem;
    gap: 1rem;
  }

  .vsplit > * {
    cursor: move;
    flex: 1;
    border: 1px solid black;
    border-radius: 0.5rem;
    padding: 0.25rem;
    gap: 1rem;
  }
</style>
