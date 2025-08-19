<script lang="ts">
    import type { Writable } from 'svelte/store';
    import { Select, SelectItem } from 'carbon-components-svelte';

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

</script>

<Select
	labelText={setting.description || 'Select option'}
    bind:selected={$settingVal}
>
	{#each setting.options as option}
		<SelectItem value={option} text={option} />
	{/each}
</Select>
