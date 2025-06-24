<script lang="ts">
	// Boolean
	import { settings } from '$lib/common/settings';
	import BooleanSetting from './components/BooleanSetting.svelte';
	import StringSetting from './components/StringSetting.svelte';
	import NumberSetting from './components/NumberSetting.svelte';
	import EnumSetting from './components/EnumSetting.svelte';
	import UnsupportedSetting from './components/UnsupportedSetting.svelte';
	import type { ComponentType } from 'svelte';

	function camelCaseToFormatted(str: string) {
		return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
	}

	const componentMap: Record<string, any> = {
		boolean: BooleanSetting,
		string: StringSetting,
		number: NumberSetting,
		enum: EnumSetting
		// Add mappings for other types as they are implemented
	};

	function getComponentForSetting(valueDescription: string): any {
		return componentMap[valueDescription] ?? UnsupportedSetting;
	}
</script>

<div class="container mx-auto p-4">

	<button class="btn btn-primary" onclick={() => {
		window.location.reload();
	}}>
		Hard Reload
	</button>

	{#each settings as settingGroup}
		<div class="card bg-base-100 shadow-xl mb-4">
			<div class="card-body">
				<h2 class="card-title text-xl font-bold mb-4">{camelCaseToFormatted(settingGroup.name)}</h2>

				<div class="space-y-4">
					{#each settingGroup.settings as setting}
						{@const Component = getComponentForSetting(setting.valueDescription)}
						<Component {setting} />
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>
