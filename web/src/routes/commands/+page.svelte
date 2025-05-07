<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toastStore } from '$lib/stores/toastStore';

	// Types for loaded data and form state
	type Command = {
		id: number;
		command_type: string;
		parameters: string | null;
		status: string;
		created_at: number;
		queued_at: number | null;
		sent_at: number | null;
		attempts: number;
		error_message: string | null;
		source_service: string;
	};

	let { data, form } = $props();

	// Reactive state for the form inputs
	let selectedCommand = $state('Ping');
	let param_board = $state('PressureBoard');
	let param_rate = $state('Fast');
	let dispatching = $state(false);
	let deleting = $state(false); // State for delete operations

	// Command definitions for the form
	const availableCommands = {
		Ping: { params: [] as string[] },
		DeployDrogue: { params: [] as string[] },
		DeployMain: { params: [] as string[] },
		PowerDown: { params: ['board'] },
		RadioRateChange: { params: ['rate'] }
	};
	type CommandName = keyof typeof availableCommands;

	const commandTypes = Object.keys(availableCommands) as CommandName[];
	const boardOptions = ['PressureBoard', 'StrainBoard', 'TemperatureBoard']; // Add others if needed
	const rateOptions = ['Fast', 'Slow'];

	// Function to format timestamps
	function formatTimestamp(ts: number | null): string {
		if (ts === null || ts === undefined) return '-';
		try {
			return new Date(ts * 1000).toLocaleString();
		} catch (e) {
			return 'Invalid Date';
		}
	}

	// Derived state to check if current command needs params
	let needsParams = $derived(availableCommands[selectedCommand as CommandName]?.params.length > 0);
	let currentParams = $derived(availableCommands[selectedCommand as CommandName]?.params);

	// Effect to show toast messages based on form action result
	$effect(() => {
		if (form?.success) {
			toastStore.success(form.message || 'Operation successful!');
			invalidateAll(); // Refresh command list on success
		}
		if (form?.error) {
			toastStore.error(form.error);
		}
		// Reset loading states regardless of outcome
		dispatching = false;
		deleting = false;
	});

	function confirmDeleteAll() {
		return window.confirm('Are you sure you want to delete ALL commands? This cannot be undone.');
	}

	function confirmDeleteSingle(id: number) {
		return window.confirm(`Are you sure you want to delete command ID ${id}?`);
	}
</script>

<div class="container mx-auto p-4 space-y-6">
	<h1 class="text-2xl font-bold">Command Dispatcher</h1>

	<!-- Dispatch Form -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Dispatch New Command</h2>
			<form
				method="POST"
				action="?/dispatch"
				use:enhance={({ cancel }) => {
					dispatching = true;
					return async ({ update }) => {
						await update({ reset: false });
					};
				}}
				class="space-y-4"
			>
				<!-- Command Type Selector -->
				<div>
					<label class="label" for="command_type">
						<span class="label-text">Command Type</span>
					</label>
					<select
						name="command_type"
						id="command_type"
						class="select select-bordered w-full max-w-xs"
						bind:value={selectedCommand}
					>
						{#each commandTypes as cmd}
							<option value={cmd}>{cmd}</option>
						{/each}
					</select>
				</div>

				<!-- Conditional Parameters -->
				{#if needsParams}
					<div class="pl-4 border-l-2 border-base-300 space-y-4">
						<h3 class="font-semibold">Parameters</h3>
						{#if currentParams.includes('board')}
							<div>
								<label class="label" for="param_board">
									<span class="label-text">Target Board</span>
								</label>
								<select
									name="param_board"
									id="param_board"
									class="select select-bordered w-full max-w-xs"
									bind:value={param_board}
								>
									{#each boardOptions as board}
										<option value={board}>{board}</option>
									{/each}
								</select>
							</div>
						{/if}
						{#if currentParams.includes('rate')}
							<div>
								<label class="label" for="param_rate">
									<span class="label-text">Radio Rate</span>
								</label>
								<select
									name="param_rate"
									id="param_rate"
									class="select select-bordered w-full max-w-xs"
									bind:value={param_rate}
								>
									{#each rateOptions as rate}
										<option value={rate}>{rate}</option>
									{/each}
								</select>
							</div>
						{/if}
						<!-- Add other parameter inputs here as needed -->
					</div>
				{/if}

				<div class="card-actions justify-end">
					<button type="submit" class="btn btn-primary" disabled={dispatching || deleting}>
						{#if dispatching}
							<span class="loading loading-spinner"></span>
							Dispatching...
						{:else}
							Dispatch Command
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>

	<!-- Command History Table -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="flex justify-between items-center mb-4">
				<h2 class="card-title">Command History (Last 100)</h2>
				<div class="flex items-center gap-2">
					<button
						class="btn btn-sm btn-outline"
						onclick={() => invalidateAll()}
						disabled={deleting || dispatching}>Refresh</button
					>
					<!-- Delete All Form -->
					<form
						method="POST"
						action="?/deleteAll"
						use:enhance={({ cancel }) => {
							if (!confirmDeleteAll()) {
								cancel();
								return;
							}
							deleting = true;
							return async ({ update }) => {
								await update();
							};
						}}
					>
						<button
							type="submit"
							class="btn btn-sm btn-error btn-outline"
							disabled={deleting || dispatching}
							title="Delete All Commands"
						>
							{#if deleting}
								<span class="loading loading-spinner loading-xs"></span>
							{/if}
							<i class="fas fa-trash"></i> Delete All
						</button>
					</form>
				</div>
			</div>
			{#if data.error}
				<div class="alert alert-error">{data.error}</div>
			{/if}
			<div class="overflow-x-auto">
				<table class="table table-zebra table-sm w-full">
					<thead>
						<tr>
							<th>ID</th>
							<th>Type</th>
							<th>Params</th>
							<th>Status</th>
							<th>Attempts</th>
							<th>Created</th>
							<th>Queued</th>
							<th>Sent</th>
							<th>Source</th>
							<th>Error</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.commands as command (command.id)}
							<tr>
								<td>{command.id}</td>
								<td>{command.command_type}</td>
								<td class="whitespace-normal break-all"
									><code class="text-xs">{command.parameters || '-'}</code></td
								>
								<td>
									<span
										class:badge-success={command.status === 'Sent'}
										class:badge-warning={command.status === 'Pending' ||
											command.status === 'Queued' ||
											command.status === 'Sending'}
										class:badge-error={command.status === 'Failed'}
										class="badge badge-sm"
									>
										{command.status}
									</span>
								</td>
								<td>{command.attempts}</td>
								<td>{formatTimestamp(command.created_at)}</td>
								<td>{formatTimestamp(command.queued_at)}</td>
								<td>{formatTimestamp(command.sent_at)}</td>
								<td>{command.source_service}</td>
								<td class="whitespace-normal break-all text-error text-xs"
									>{command.error_message || '-'}</td
								>
								<td>
									<!-- Delete Single Form -->
									<form
										method="POST"
										action="?/deleteSingle"
										use:enhance={({ cancel }) => {
											if (!confirmDeleteSingle(command.id)) {
												cancel();
												return;
											}
											deleting = true;
											return async ({ update }) => {
												await update();
											};
										}}
										class="inline-block"
									>
										<input type="hidden" name="id" value={command.id} />
										<button
											type="submit"
											class="btn btn-xs btn-ghost text-error"
											title="Delete Command {command.id}"
											disabled={deleting || dispatching}
										>
											{#if deleting}
												<span class="loading loading-spinner loading-xs"></span>
											{:else}
												<i class="fas fa-trash"></i>
											{/if}
										</button>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="11" class="text-center">No commands found.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
