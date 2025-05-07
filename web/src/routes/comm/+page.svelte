<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	// Types
	type ServiceType = 'SerGW' | 'Hydrand';
	type ServiceStatus = {
		active_service: string | null;
		details: string | null;
		message: string;
	};

	// State
	let status = $state<ServiceStatus | null>(data.initialStatus);
	let isLoading = $state(false);
	let error = $state<string | null>(data.error);
	let selectedService = $state<ServiceType>('SerGW');
	let serialPort = $state('/dev/ttyUSB0');
	let baudRate = $state(57600);
	let interval = $state(100);
	let libsqlUrl = $state('http://localhost:8080');
	let outputAddress = $state('127.0.0.1');
	let outputPort = $state(5656);
	let daemonLogs = $state<string[]>(data.initialLogs || []);
	let logsError = $state<string | null>(data.logsError || null);

	// Fetch status
	async function fetchStatus() {
		try {
			const response = await fetch('/comm/api');
			if (!response.ok) throw new Error(`Failed to fetch status: ${response.statusText}`);
			status = await response.json();
			error = null;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch status';
			toastStore.error(error);
		}
	}

	// Fetch daemon logs
	async function fetchDaemonLogs() {
		try {
			const response = await fetch('/comm/logs/api');
			if (!response.ok) throw new Error(`Failed to fetch daemon logs: ${response.statusText}`);
			const logData = await response.json();
			daemonLogs = logData.logs || [];
			logsError = null;
		} catch (e) {
			logsError = e instanceof Error ? e.message : 'Failed to fetch daemon logs';
			// Do not spam toasts for log errors, just show in UI
			console.error(logsError);
		}
	}

	// Start service
	async function startService() {
		isLoading = true;
		try {
			const payload = {
				service_type: selectedService,
				serial_port: selectedService === 'SerGW' ? serialPort : undefined,
				baud_rate: selectedService === 'SerGW' ? baudRate : undefined,
				interval: selectedService === 'Hydrand' ? interval : undefined,
				libsql_url: selectedService === 'Hydrand' ? libsqlUrl : undefined,
				output_tcp_address: outputAddress,
				output_tcp_port: outputPort
			};

			const response = await fetch('/comm/api?action=start', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) throw new Error(`Failed to start service: ${response.statusText}`);
			const result = await response.json();
			status = result;
			toastStore.success('Service started successfully');
			error = null;
			await fetchDaemonLogs(); // Fetch logs after action
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to start service';
			toastStore.error(error);
		} finally {
			isLoading = false;
		}
	}

	// Stop service
	async function stopService() {
		isLoading = true;
		try {
			const response = await fetch('/comm/api?action=stop', {
				method: 'POST'
			});

			if (!response.ok) throw new Error(`Failed to stop service: ${response.statusText}`);
			const result = await response.json();
			status = result;
			toastStore.success('Service stopped successfully');
			error = null;
			await fetchDaemonLogs(); // Fetch logs after action
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to stop service';
			toastStore.error(error);
		} finally {
			isLoading = false;
		}
	}

	// Poll status and logs
	let statusInterval: ReturnType<typeof setInterval>;
	let logsInterval: ReturnType<typeof setInterval>;
	onMount(() => {
		// Initial data is from SSR, set up polling
		fetchStatus(); // Fetch latest on mount too
		fetchDaemonLogs(); // Fetch latest on mount too

		statusInterval = setInterval(fetchStatus, 2000);
		logsInterval = setInterval(fetchDaemonLogs, 3500); // Poll logs slightly less frequently
		return () => {
			clearInterval(statusInterval);
			clearInterval(logsInterval);
		};
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-6">Hydra Manager Daemon</h1>

	<!-- Status Card -->
	<div class="card bg-base-100 shadow-xl mb-6">
		<div class="card-body">
			<h2 class="card-title">Service Status</h2>
			{#if error}
				<div class="alert alert-error">
					<span>{error}</span>
				</div>
			{:else if status}
				<div class="stats shadow">
					<div class="stat">
						<div class="stat-title">Active Service</div>
						<div class="stat-value text-lg">{status.active_service || 'None'}</div>
						{#if status.details}
							<div class="stat-desc">{status.details}</div>
						{/if}
					</div>
					<div class="stat">
						<div class="stat-title">Status Message</div>
						<div class="stat-value text-lg">{status.message}</div>
					</div>
				</div>
			{:else}
				<div class="flex justify-center">
					<span class="loading loading-spinner loading-lg"></span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Service Control and Logs Flex Container -->
	<div class="flex flex-wrap gap-6 mb-6">
		<!-- Control Card -->
		<div class="card bg-base-100 shadow-xl flex-1 min-w-[320px]">
			<div class="card-body">
				<h2 class="card-title">Service Control</h2>

				<!-- Service Type Selection -->
				<div class="form-control w-full max-w-xs mb-4">
					<label class="label" for="serviceTypeSelect">
						<span class="label-text">Service Type</span>
					</label>
					<select
						id="serviceTypeSelect"
						class="select select-bordered w-full"
						bind:value={selectedService}
					>
						<option value="SerGW">Serial Gateway (SerGW)</option>
						<option value="Hydrand">Random Data Generator (Hydrand)</option>
					</select>
				</div>

				<!-- SerGW Specific Settings -->
				{#if selectedService === 'SerGW'}
					<div class="form-control w-full max-w-xs mb-4">
						<label class="label" for="serialPortInput">
							<span class="label-text">Serial Port</span>
						</label>
						<input
							id="serialPortInput"
							type="text"
							class="input input-bordered w-full"
							bind:value={serialPort}
							placeholder="/dev/ttyUSB0"
						/>
					</div>
					<div class="form-control w-full max-w-xs mb-4">
						<label class="label" for="baudRateInput">
							<span class="label-text">Baud Rate</span>
						</label>
						<input
							id="baudRateInput"
							type="number"
							class="input input-bordered w-full"
							bind:value={baudRate}
						/>
					</div>
				{/if}

				<!-- Hydrand Specific Settings -->
				{#if selectedService === 'Hydrand'}
					<div class="form-control w-full max-w-xs mb-4">
						<label class="label" for="intervalInput">
							<span class="label-text">Interval (ms)</span>
						</label>
						<input
							id="intervalInput"
							type="number"
							class="input input-bordered w-full"
							bind:value={interval}
						/>
					</div>
					<div class="form-control w-full max-w-xs mb-4">
						<label class="label" for="libsqlUrlInput">
							<span class="label-text">LibSQL URL</span>
						</label>
						<input
							id="libsqlUrlInput"
							type="text"
							class="input input-bordered w-full"
							bind:value={libsqlUrl}
							placeholder="http://localhost:8080"
						/>
					</div>
				{/if}

				<!-- Common Settings -->
				<div class="form-control w-full max-w-xs mb-4">
					<label class="label" for="outputAddressInput">
						<span class="label-text">Output TCP Address</span>
					</label>
					<input
						id="outputAddressInput"
						type="text"
						class="input input-bordered w-full"
						bind:value={outputAddress}
						placeholder="127.0.0.1"
					/>
				</div>
				<div class="form-control w-full max-w-xs mb-4">
					<label class="label" for="outputPortInput">
						<span class="label-text">Output TCP Port</span>
					</label>
					<input
						id="outputPortInput"
						type="number"
						class="input input-bordered w-full"
						bind:value={outputPort}
					/>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-4">
					<button class="btn btn-primary" onclick={startService} disabled={isLoading}>
						{#if isLoading}
							<span class="loading loading-spinner"></span>
						{:else}
							Start Service
						{/if}
					</button>
					<button class="btn btn-error" onclick={stopService} disabled={isLoading}>
						{#if isLoading}
							<span class="loading loading-spinner"></span>
						{:else}
							Stop Service
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Daemon Logs Card -->
		<div class="card bg-base-100 shadow-xl flex-1 min-w-[320px]">
			<div class="card-body">
				<div class="flex justify-between items-center">
					<h2 class="card-title">Daemon Logs</h2>
					<button
						class="btn btn-sm btn-ghost"
						onclick={fetchDaemonLogs}
						title="Refresh Logs"
						aria-label="Refresh Logs"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					</button>
				</div>
				{#if logsError}
					<div class="alert alert-warning">
						<span>Error fetching logs: {logsError}</span>
					</div>
				{/if}
				{#if daemonLogs && daemonLogs.length > 0}
					<div class="bg-base-200 p-3 rounded-md max-h-96 overflow-y-auto text-xs font-mono">
						{#each daemonLogs as logLine}
							<div>{logLine}</div>
						{/each}
					</div>
				{:else if !logsError}
					<p class="text-sm text-base-content/70">No logs to display or logs are loading...</p>
				{/if}
			</div>
		</div>
	</div>
</div>
