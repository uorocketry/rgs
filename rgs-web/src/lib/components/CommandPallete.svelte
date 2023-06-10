<script lang="ts">
  import { browser } from "$app/environment";
  import { getStringScores } from "$lib/common/stringCmp";
  import { onDestroy, onMount, tick } from "svelte";

  let results = ["dork", "amazing", "dope"];
  let visible = true;
  let searchInput: HTMLInputElement;
  let selected = 1;
  let searchValue = "dor";
  let matches: string[] = [];

  $: if (browser) {
    let matchScores: number[] = getStringScores(searchValue, results);
    matches = matchScores
      .map((score, i) => ({ score, i }))
      .sort((a, b) => b.score - a.score)
      .map((x) => results[x.i]);
    console.log(matches);
  }

  async function listenToToggle(e: KeyboardEvent) {
    // Ctrl + P to toggle
    if (e.ctrlKey && e.key === "p") {
      e.preventDefault();
      visible = !visible;
      await tick();
      if (visible) {
        searchInput?.focus();
      }
    }
    // esc to close
    if (e.key === "Escape") {
      visible = false;
    }
  }

  onMount(() => {
    window.addEventListener("keydown", listenToToggle);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", listenToToggle);
  });
</script>

{#if visible}
  <div
    class="absolute top-2 left-1/2 -translate-x-1/2 z-50 rounded
     bg-base-300 w-full max-w-screen-sm p-2 flex flex-col gap-2"
  >
    <!-- Header -->
    <input
      bind:this={searchInput}
      bind:value={searchValue}
      class="input input-sm input-bordered"
      placeholder="Search"
    />
    <!-- Results -->
    <ul class="menu menu-xs w-full bg-base-200 rounded">
      {#each matches as result, i}
        <li>
          <button>{result}</button>
        </li>
      {/each}
    </ul>
  </div>
{/if}
