<script lang="ts">
	// Boolean
	import { settings } from '$lib/common/settings';
	import { get } from 'svelte/store';

	function camelCaseToFormatted(str: string) {
		return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
	}
</script>

{#each settings as settingGroup}
	<div class="card p-4 m-2">
		{camelCaseToFormatted(settingGroup.name)} <br />

		{#each settingGroup.settings as setting}
			<label class="flex items-center gap-2">
				<!-- "string" | "number" | "boolean" | "array" | "kv" | "enum" -->
				{#if setting.valueDescription === 'boolean'}
					{@const settingVal = setting.value}
					{@const settingValue = get(setting.value)}

					<input
						class="checkbox"
						checked={settingValue}
						type="checkbox"
						on:change={() => {
							settingVal.set(!get(settingVal));
						}}
					/>
				{:else if setting.valueDescription === 'number'}
					{@const settingVal = setting.value}
					{@const settingValue = get(setting.value)}

					<input
						class="input"
						value={settingValue}
						type="number"
						on:change={(e) => {
							settingVal.set(Number(e.target?.value ?? 0));
						}}
					/>
				{:else if setting.valueDescription === 'string'}
					{@const settingVal = setting.value}
					{@const settingValue = get(setting.value)}

					<input
						class="input"
						value={settingValue}
						type="text"
						on:change={(e) => {
							settingVal.set(e.target?.value ?? 0);
						}}
					/>
				{:else if setting.valueDescription === 'array'}
					Is Array
				{:else if setting.valueDescription === 'kv'}
					Is KV
				{:else if setting.valueDescription === 'enum'}
					Is Enum
				{:else}
					Is Unknown
				{/if}
				{setting.description}
			</label>
		{/each}
	</div>
{/each}
