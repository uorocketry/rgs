<script lang="ts">
  import { get, writable } from "svelte/store";
  import { theme } from "$lib/common/utils";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let themeState: boolean = false;
  let socketOK = writable(false);
  onMount(() => {
    // TODO: Update me
    // socketOK = ClientSocket.connected;
    let initialTheme = "light";
    if (browser && localStorage.getItem("theme")) {
      initialTheme = localStorage.getItem("theme") || initialTheme;
    }
    themeState = initialTheme !== "dark";
    theme.set(initialTheme);

    theme.subscribe((newTheme) => {
      if (browser) {
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        themeState = newTheme !== "dark";
      }
    });
  });
</script>

<div class="navbar">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost normal-case text-xl">RGS</a>
    <div class="tooltip tooltip-bottom" data-tip="Dashboard">
      <a href="/dashboard" class="btn btn-ghost normal-case text-xl">
        <i class="fa-solid fa-chart-line"></i>
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Recovery">
      <a href="/recovery" class="btn btn-ghost normal-case text-xl">
        <i class="fa-solid fa-parachute-box"></i>
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Settings">
      <a href="/settings" class="btn btn-ghost normal-case text-xl">
        <i class="fa-solid fa-gear"></i>
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Logging">
      <a href="/logging" class="btn btn-ghost normal-case text-xl">
        <i class="fa-solid fa-file-lines"></i>
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Status">
      <button class="btn btn-ghost normal-case text-xl">
        {#if $socketOK}
          <i class="fa-solid fa-link text-green-500"></i>
        {:else}
          <i class="fa-solid fa-link-slash text-red-500"></i>
        {/if}
      </button>
    </div>
  </div>
  <div class="navbar-end">
    <div class="tooltip tooltip-bottom" data-tip="Theme">
      <label class="btn btn-ghost text-xl swap swap-rotate">
        <input
          type="checkbox"
          bind:checked="{themeState}"
          on:change="{() =>
            theme.set(get(theme) === 'light' ? 'dark' : 'light')}"
        />
        <i class="swap-on fa-solid fa-sun text-yellow-500"></i>
        <i class="swap-off fa-solid fa-moon text-current"></i>
      </label>
    </div>
  </div>
</div>
