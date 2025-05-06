<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';

	type $$Props = {
		setting: {
			valueDescription: 'string';
			value: Writable<string>;
			description?: string;
			placeholder?: string;
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
		type="text"
		placeholder={setting.placeholder ?? 'Enter text...'}
		class="input input-bordered w-full"
		bind:value={$settingVal}
	/>
</div>
