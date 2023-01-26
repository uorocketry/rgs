<script lang="ts">
  import { ClientSocket } from "$lib/common/ClientSocket";
  import { get } from "svelte/store";
  import { theme } from "$lib/common/utils";
  import { browser } from "$app/environment";

  let socketOK = ClientSocket.connected;
  let initialTheme = "light";
  if (browser && localStorage.getItem("theme")) {
    initialTheme = localStorage.getItem("theme") || initialTheme;
  }
  let themeState: boolean = initialTheme !== "dark";
  theme.set(initialTheme);

  theme.subscribe((newTheme) => {
    if (browser) {
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      themeState = newTheme !== "dark";
    }
  });
</script>

<div class="navbar">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost normal-case text-xl">RGS</a>
    <div class="tooltip tooltip-bottom" data-tip="Dashboard">
      <a href="/dashboard" class="btn btn-ghost normal-case text-xl">
        <i class="fa-solid fa-chart-line" />
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Recovery">
      <a href="/recovery" class="btn btn-ghost normal-case text-xl">
        <i class="fa-solid fa-parachute-box" />
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Settings">
      <a href="/settings" class="btn btn-ghost normal-case text-xl">
        <i class="fa-solid fa-gear" />
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Logging">
        <a href="/logging" class="btn btn-ghost normal-case text-xl">
          <i class="fa-solid fa-file-lines" />
        </a>
      </div>

    <div class="tooltip tooltip-bottom" data-tip="Status">
      <button class="btn btn-ghost normal-case text-xl">
        {#if $socketOK}
          <i class="fa-solid fa-link text-green-500" />
        {:else}
          <i class="fa-solid fa-link-slash text-red-500" />
        {/if}
      </button>
    </div>
  </div>
  <div class="navbar-end">
    <div class="tooltip tooltip-bottom" data-tip="Theme">
      <label class="btn btn-ghost text-xl swap swap-rotate">
        <input
          type="checkbox"
          bind:checked={themeState}
          on:change={() => theme.set(get(theme) === "light" ? "dark" : "light")}
        />
        <i class="swap-on fa-solid fa-sun text-yellow-500" />
        <i class="swap-off fa-solid fa-moon text-current" />
      </label>
    </div>
  </div>
</div>

<!-- <Fa class="swap-on fill-current" icon={faSun} color="tomato" /> -->
<!-- <Fa class="swap-off fill-current" icon={faMoon} color="silver" /> -->
