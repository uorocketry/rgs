<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let dropdownLabel = 'Options';
	export let options: string[] = [];
	export let selected: string[] = [];

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox-' + dropdownLabel,
		placement: 'bottom'
	};
</script>

<div class="card py-2" data-popup="popupCombobox-{dropdownLabel}">
	<div class="overflow-auto max-h-64">
		<ListBox multiple>
			{#each options as option}
				<ListBoxItem bind:group={selected} name="{dropdownLabel}-{option}" value={option}
					>{option}</ListBoxItem
				>
			{/each}
		</ListBox>
	</div>
	<div class="arrow bg-surface-100-800-token" />
</div>

<button class="btn variant-filled" use:popup={popupCombobox}>
	{dropdownLabel}
</button>
