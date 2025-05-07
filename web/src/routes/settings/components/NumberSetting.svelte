<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';

	type $$Props = {
		setting: {
			valueDescription: 'number';
			value: Writable<number>;
			description?: string;
			min?: number;
			max?: number;
			step?: number;
		};
	};
	let { setting }: $$Props = $props();

	const settingVal = setting.value;
</script>

<div class="form-control w-full">
	<label class="label">
		{#if setting.description}
			<span class="label-text">{setting.description}</span>
		{/if}
	</label>
	<input
		type="number"
		class="input input-bordered w-full"
		min={setting.min}
		max={setting.max}
		step={setting.step ?? 1}
		bind:value={$settingVal}
	/>
</div>
