<!-- Checkbox group -->
<script lang="ts">
  export let dropdownLabel: string = "Options";
  export let options: string[] = [];
  export let selected: string[] = [];
</script>

<div class="dropdown dropdown-bottom">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <label tabindex="0" class="btn m-1">{dropdownLabel}</label>
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div class="dropdown-content">
    <ul
      tabindex="0"
      class="menu p-2 shadow bg-base-100 rounded-box max-h-96 overflow-scroll flex-row"
    >
      {#each options as option}
        <li class="form-control flex-1">
          <label class="label cursor-pointer">
            <span class="label-text">{option}</span>
            <input
              type="checkbox"
              bind:group="{selected}"
              checked="{selected.includes(option)}"
              value="{option}"
              class="checkbox"
            />
          </label>
        </li>
      {/each}
    </ul>
  </div>
</div>
