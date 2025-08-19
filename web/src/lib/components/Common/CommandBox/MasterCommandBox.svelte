<script lang="ts">
	import { commandActions, commandReqAdaptor, type CommandRequest } from '$lib/common/actions';
	import { commandBoxToggle } from '$lib/stores';
	import { tick } from 'svelte';
	import CommandBox from './CommandBox.svelte';

	let inputElement = $state<HTMLInputElement | null>(null);
	let inputValue = $state('');
	let list = $state<string[]>([]);
	let placeholder = $state('Search by name');
	let prompt = $state('');
	let selectedIndex = $state(0);
	let cmdBox = $state<CommandBox | null>(null);
	let currentResolve = $state<((value: any) => void) | null>(null);

	const cmdAdaptor: CommandRequest = {
		string: async (reqPrompt, reqPlaceholder = '...') => {
			inputValue = '';
			list = [];
			placeholder = reqPlaceholder;
			prompt = reqPrompt;

			return new Promise((resolve) => {
				currentResolve = resolve;
				cmdBox?.show();
			});
		},
		select: async (reqPrompt, options, reqPlaceholder = 'Search by name') => {
			inputValue = '';
			list = options;
			prompt = reqPrompt;
			placeholder = reqPlaceholder;

			return new Promise((resolve) => {
				currentResolve = resolve;
				cmdBox?.show();
			});
		}
	};
	commandReqAdaptor.set(cmdAdaptor);

	function handleEnter(err: boolean) {
		if (!currentResolve) return;
		if (err) {
			currentResolve(undefined);
			console.warn('Command input resolved to: undefined');
		} else {
			currentResolve(inputValue);
			console.log('Command input resolved to:', inputValue);
		}
		cmdBox?.hide();
		currentResolve = null;
	}

	function handleClick(item: number, err: boolean) {
		if (!currentResolve) return;
		if (err) {
			currentResolve(undefined);
		} else {
			currentResolve(item);
		}
		cmdBox?.hide();
		currentResolve = null;
	}

	async function chooseAction() {
		const actions = $commandActions;
		if (!actions) return;
		let actionNames = actions.map((a) => a.name);
		let choice: number | undefined = await cmdAdaptor.select(
			'',
			actionNames,
			'Search action by name'
		);
		if (choice === undefined) {
			return;
		}
		let action = actions[choice];
		if (action) {
			action.do();
		}
	}

	$effect(() => {
		async function listenToToggle(e: KeyboardEvent) {
			if (e.key === '`') {
				e.preventDefault();
				const dialogIsOpen = cmdBox?.getDialogElement()?.hasAttribute('open');
				if (!dialogIsOpen) {
					inputValue = '';
					selectedIndex = 0;
					cmdBox?.show();
					chooseAction();
				} else {
					cmdBox?.hide();
				}
			}
		}
		window.addEventListener('keydown', listenToToggle);

		const unsubscribe = commandBoxToggle.subscribe(async () => {
			const dialogIsOpen = cmdBox?.getDialogElement()?.hasAttribute('open');
			if (!dialogIsOpen) {
				selectedIndex = 0;
				placeholder = 'Search commands by name';
				cmdBox?.show();
				chooseAction();
			} else {
				cmdBox?.hide();
			}
		});

		return () => {
			window.removeEventListener('keydown', listenToToggle);
			unsubscribe();
		};
	});
</script>

<CommandBox
	bind:this={cmdBox}
	bind:selectedIndex
	bind:inputElement
	bind:inputValue
	{placeholder}
	{prompt}
	{list}
	onEnter={handleEnter}
	onClick={handleClick}
/>
