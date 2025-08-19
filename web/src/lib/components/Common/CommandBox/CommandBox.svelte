<script lang="ts">
	import { getStringScores } from '$lib/common/stringCmp';
	import { tick } from 'svelte';
	// import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton'; // Removed Skeleton imports
	// import { onDestroy, onMount } from 'svelte'; // Replaced by $effect, $derived, $state

	// Get props using runes
	let {
		prompt,
		selectedIndex = $bindable(), // Make bindable
		placeholder,
		list,
		inputValue = $bindable(), // Make bindable
		inputElement = $bindable(), // Make bindable
		onEnter: _onEnter, // Pass callback directly
		onClick: _onClick
		// onSelectedIndexChange // No longer needed with bind:selectedIndex
	} = $props<{
		prompt: string;
		selectedIndex: number;
		placeholder: string;
		list: string[];
		inputValue: string;
		inputElement: HTMLInputElement | null;
		onEnter: (err: boolean) => void;
		onClick: (item: number, err: boolean) => void;
		// onSelectedIndexChange: (newIndex: number) => void; // No longer needed
	}>();

	// Internal state
	let dialogElement = $state<HTMLDialogElement | null>(null);

	// Derived state for the filtered list
	let displayedList = $derived(() => {
		let scores: number[] = getStringScores(inputValue, list);
		const sorted = scores
			.map((score, i) => ({ score, index: i }))
			.sort((a, b) => b.score - a.score)
			.map((a) => a.index);

		// Ensure selectedIndex is valid after list update
		// NOTE: Mutating selectedIndex prop directly is not ideal in runes.
		// This logic might need to move to the parent or use a callback.
		// For now, we calculate based on the derived list length.
		if (selectedIndex >= sorted.length) {
			// This won't update the parent state directly.
			// selectedIndex = Math.max(0, sorted.length - 1);
		}
		return sorted;
	});

	// Effect for keyboard event listener
	$effect(() => {
		const implOnEnter = (e: KeyboardEvent) => {
			// Explicitly read derived value for this execution context
			const currentDisplayedList = displayedList();

			if (e.key === 'Enter') {
				e.preventDefault();
				// Use the local variable currentDisplayedList
				if (currentDisplayedList.length > 0 && selectedIndex < currentDisplayedList.length) {
					_onClick(currentDisplayedList[selectedIndex], false);
				} else {
					_onEnter(false);
				}
			} else if (e.key === 'ArrowDown') {
				e.preventDefault();
				const listLength = currentDisplayedList.length;
				if (listLength > 0) {
					// Directly update bindable prop
					selectedIndex = (selectedIndex + 1) % listLength;
				}
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				const listLength = currentDisplayedList.length;
				if (listLength > 0) {
					// Directly update bindable prop
					selectedIndex = (selectedIndex - 1 + listLength) % listLength;
				}
			}
		};

		window.addEventListener('keydown', implOnEnter);

		return () => {
			window.removeEventListener('keydown', implOnEnter);
		};
	});

	// Helper function to trigger the click callback (now just calls prop)
	function triggerClick(listIndex: number) {
		_onClick(listIndex, false);
	}

	// Exported functions for parent control
	export function show() {
		if (dialogElement) {
			dialogElement.showModal();
			// Attempt focus after a short delay
			setTimeout(() => {
				inputElement?.focus();
			}, 50); // 50ms delay, adjust if needed
		}
	}
	export function hide() {
		if (dialogElement) dialogElement.close();
	}

	// Expose dialogElement for parent checks (used in MasterCommandBox)
	export function getDialogElement() {
		return dialogElement;
	}
</script>

<!-- DaisyUI Modal structure -->
<dialog class="modal modal-top" bind:this={dialogElement} open={true}>
	<div class="modal-box">
		{#if prompt}
			<label for="command_input" class="label pb-1">
				<span class="label-text-alt text-sm">{prompt}</span>
			</label>
		{/if}

		<input
			id="command_input"
			bind:this={inputElement}
			bind:value={inputValue}
			class="input input-bordered w-full mb-2"
			{placeholder}
			autocomplete="off"
		/>

		<!-- Results -->
		{#if list.length > 0}
			<!-- Check if derived list has items -->
			{#if ((displayListValue) => displayListValue.length > 0)(displayedList())}
				<!-- Assign derived value inside the block where it's used -->
				{@const currentList = displayedList()}
				<ul class="menu bg-base-200 rounded-box max-h-60 overflow-y-auto p-2">
					{#each currentList as listIndex, i}
						<li>
							<button
								type="button"
								class="text-left w-full"
								class:menu-active={selectedIndex === i}
								onclick={() => triggerClick(listIndex)}>{list[listIndex]}</button
							>
						</li>
					{/each}
				</ul>
			{:else if inputValue}
				<!-- Show 'No results' only if there was input but the filtered list is empty -->
				<div class="text-center text-sm text-base-content/70 py-4">No results found.</div>
			{/if}
		{/if}
	</div>
	<!-- Click outside to close -->
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
