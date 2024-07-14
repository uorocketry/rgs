<script lang="ts">
	import { getStringScores } from '$lib/common/stringCmp';
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

<div class="prompt-wrapper">
	<div class="prompt">
		{#if prompt}
			<span class="text-sm">{prompt}</span>
		{/if}

		<input bind:this={inputElement} bind:value={inputValue} {placeholder} />

		<!-- Results -->
		{#if list.length > 0}
			<select size={Math.min(10, list.length)} bind:value={selectedIndex}>
				{#each displayedList as listIndex, i}
					<option
						on:click={() => {
							_onClick(listIndex, false);
							_onClick = UNDEF_FUN;
						}}
						value={i}
						>{list[listIndex]}
					</option>
				{/each}
			</select>
		{/if}
	</div>
</div>

<style>
	.prompt {
		padding: 0.5rem 1rem;
		z-index: 50;
		background-color: var(--color-base);
		max-width: min(100%, 50rem);

		color: var(--color-on-base);
		outline: var(--color-on-base) dashed 1px;
		outline-offset: -1px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.prompt-wrapper {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: start;
		padding-left: 3rem;
	}

	select {
		background-color: var(--color-base);
		color: var(--color-on-base);
		border: none;
		outline: none;
	}

	option {
		background-color: var(--color-base);
		color: var(--color-on-base);
	}

	option:checked {
		background-color: var(--color-on-base);
		color: var(--color-base);
	}

	input {
		background-color: var(--color-base);
		color: var(--color-on-base);
		border: none;
		outline: none;
		outline-offset: -1px;
		outline: var(--color-on-base) dashed 1px;
	}
</style>
