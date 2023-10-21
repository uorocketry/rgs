<script lang="ts">
	import { commandActions, commandReqAdaptor, type CommandRequest } from '$lib/common/actions';
	import { commandBoxToggle } from '$lib/stores';
	import { onDestroy, onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import CommandBox from './CommandBox.svelte';

	let visible = true;
	let inputElement: HTMLInputElement;
	let inputValue = '';
	let list: string[] = [];
	let placeholder = 'Search by name';
	let prompt = '';
	let selectedIndex = 0;

	let cmdAdaptor: CommandRequest = {
		string: async (reqPrompt, reqPlaceholder = '...') => {
			visible = true;
			inputValue = '';
			list = [];
			placeholder = reqPlaceholder;
			prompt = reqPrompt;
			await tick();
			inputElement.focus();

			return new Promise((resolve) => {
				cmdBox?.onEnter((err) => {
					if (err) {
						resolve(undefined);
						console.log('Resolving to undefined');
						return;
					}
					resolve(inputValue);
					console.log('Resolving to', inputValue);
					visible = false;
				});
			});
		},
		select: async (reqPrompt, options, reqPlaceholder = 'Search by name') => {
			visible = true;
			inputValue = '';
			list = options;
			prompt = reqPrompt;
			placeholder = reqPlaceholder;
			await tick();
			inputElement.focus();

			return new Promise((resolve) => {
				cmdBox?.onClick((item, err) => {
					if (err) {
						resolve(undefined);
						return;
					}
					resolve(item);
					visible = false;
				});
			});
		}
	};
	commandReqAdaptor.set(cmdAdaptor);

	async function chooseAction() {
		let actionNames = get(commandActions).map((a) => a.name);
		let choice: number | undefined = await cmdAdaptor.select(
			'',
			actionNames,
			'Search action by name'
		); // Number
		if (choice === undefined) {
			return;
		}
		let action = get(commandActions)[choice];
		action.do();
	}

	async function listenToToggle(e: KeyboardEvent) {
		// tilde "`" to toggle
		if (e.key === '`') {
			e.preventDefault();
			if (!visible) inputValue = '';
			visible = !visible;
			await tick();
			if (visible) {
				selectedIndex = 0;
				inputElement.focus();
				chooseAction();
			}
		}
		// esc to close
		if (e.key === 'Escape') {
			visible = false;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', listenToToggle);
		commandBoxToggle.subscribe(() => {
			visible = !visible;
			if (visible) {
				selectedIndex = 0;
				placeholder = 'Search commands by name';
				inputElement?.focus();
				chooseAction();
			}
		});
	});

	onDestroy(() => {
		window.removeEventListener('keydown', listenToToggle);
	});

	let cmdBox: CommandBox;
</script>

{#if visible}
	<CommandBox
		bind:this={cmdBox}
		bind:selectedIndex
		{placeholder}
		{prompt}
		{list}
		bind:inputElement
		bind:inputValue
	/>
{/if}
