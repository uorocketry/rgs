<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';

	type $$Props = {
		setting: {
			valueDescription: 'enum';
			options: string[];
			value: Writable<string>;
			description?: string;
		};
	};
	let { setting }: $$Props = $props();

	const settingVal = setting.value;

	function handleChange(event: Event & { currentTarget: HTMLSelectElement }) {
		settingVal.set(event.currentTarget.value ?? '');
	}
</script>

<div class="form-control w-full">
	<label class="label">
		{#if setting.description}
			<span class="label-text">{setting.description}</span>
		{/if}
	</label>
	<select class="select select-bordered w-full" bind:value={$settingVal} onchange={handleChange}>
		{#each setting.options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>
