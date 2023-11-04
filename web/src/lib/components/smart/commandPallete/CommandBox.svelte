<script lang="ts">
	import { getStringScores } from '$lib/common/stringCmp';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';

	const UNDEF_FUN = () => undefined;
	export let prompt = '';
	export let selectedIndex = 0;
	export let placeholder = 'Search commands by name';
	export let list: string[] = [];
	export let inputValue = '';
	export let inputElement: HTMLInputElement | null = null;

	$: {
		// Wrap selectedIndex around the list
		let wrappedVal = (selectedIndex + list.length) % list.length;
		if (wrappedVal !== selectedIndex) {
			selectedIndex = wrappedVal;
		}
	}

	let _onEnter: (err: boolean) => void = UNDEF_FUN;
	/**
	 * Listen for enter key presses, we can only have one listener at a time.
	 * If there is already a listener, it will be called with an error.
	 * @param cb
	 */
	export function onEnter(cb: (err: boolean) => void) {
		// If something is already waiting, cancel it and start a new one
		if (_onEnter !== UNDEF_FUN) {
			_onEnter(true);
			_onEnter = UNDEF_FUN;
		}

		_onEnter = cb;
	}

	let _onClick: (item: number, err: boolean) => void = UNDEF_FUN;
	export function onClick(cb: (item: number, err: boolean) => void) {
		if (_onClick !== UNDEF_FUN) {
			_onClick(-1, true);
			_onClick = UNDEF_FUN;
		}
		_onClick = cb;
	}

	let displayedList: number[] = [];
	$: {
		selectedIndex = 0; // Reset selected index when list changes
		let scores: number[] = getStringScores(inputValue, list);
		displayedList = scores
			.map((score, i) => ({ score, index: i }))
			.sort((a, b) => b.score - a.score)
			.map((a) => a.index);
	}

	// Use enter to select the first item (if there is one)
	let implOnEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			if (displayedList.length > 0) {
				_onClick(displayedList[selectedIndex], false);
			}
			_onEnter(false);
			_onEnter = UNDEF_FUN;
			_onClick = UNDEF_FUN;
		}
		// Arrow down and up to changed selected index
		else if (e.key === 'ArrowDown') {
			selectedIndex++;
		} else if (e.key === 'ArrowUp') {
			selectedIndex--;
		}
	};

	onMount(() => {
		window.addEventListener('keydown', implOnEnter);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', implOnEnter);
	});

	$: selectedIndex = 0;
</script>

<div
	class="absolute top-0 right-0 left-0 mx-auto
	px-2 py-1
	max-w-sm
	z-50
	bg-surface-300-600-token
    w-full flex flex-col gap-2"
>
	{#if prompt}
		<span class="text-sm">{prompt}</span>
	{/if}

	<div class="flex place-content-center max-h-8">
		<input
			bind:this={inputElement}
			bind:value={inputValue}
			class="input w-full max-w-sm"
			{placeholder}
		/>
	</div>

	<!-- Results -->
	{#if list.length > 0}
		<ListBox>
			{#each displayedList as listIndex, i}
				<ListBoxItem
					on:click={() => {
						_onClick(listIndex, false);
						_onClick = UNDEF_FUN;
					}}
					bind:group={selectedIndex}
					name={i.toString()}
					value={i}>{list[listIndex]}</ListBoxItem
				>
			{/each}
		</ListBox>
	{/if}
</div>
