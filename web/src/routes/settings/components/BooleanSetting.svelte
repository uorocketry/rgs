<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';

	type $$Props = {
		setting: {
			valueDescription: 'boolean';
			value: Writable<boolean>;
			description?: string;
		};
	};
	let { setting }: $$Props = $props();

	const settingVal = setting.value;
</script>

<div class="form-control">
	<label class="label cursor-pointer justify-start gap-4">
		<input type="checkbox" class="toggle toggle-primary" bind:checked={$settingVal} />
		{#if setting.description}
			<span class="label-text">{setting.description}</span>
		{/if}
	</label>
</div>
