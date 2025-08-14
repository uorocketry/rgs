<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import {
		Grid,
		Row,
		Column,
		Tile,
		InlineNotification,
		InlineLoading,
		Dropdown,
		TextInput,
		NumberInput,
		Button,
		Tag,
		CodeSnippet
	} from 'carbon-components-svelte';

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

<Grid padding={true}>
    <Row>
        <Column>
            <h1>Hydra Manager Daemon</h1>
        </Column>
    </Row>

	<!-- Status Card -->
    <Row>
        <Column>
            <Tile>
                <h2>Service Status</h2>
                {#if error}
                    <InlineNotification kind="error" title="Error" subtitle={error} hideCloseButton />
                {:else if status}
                    <p>
                        <strong>Active Service:</strong>
                        <Tag type={status.active_service ? 'green' : 'gray'}>{status.active_service || 'None'}</Tag>
                    </p>
                    <p><strong>Status Message:</strong> {status.message}</p>
                    {#if status.details}<p>{status.details}</p>{/if}
                {:else}
                    <InlineLoading description="Loading status..." />
                {/if}
            </Tile>
        </Column>
    </Row>

	<!-- Service Control and Logs Flex Container -->
    <Row>
        <Column sm={16} md={8} lg={8}>
            <Tile>
                <h2>Service Control</h2>
                <Dropdown
                    items={[{ id: 'SerGW', text: 'Serial Gateway (SerGW)' }, { id: 'Hydrand', text: 'Random Data Generator (Hydrand)' }]}
                    selectedId={selectedService}
                    label="Service Type"
                    on:select={(e) => (selectedService = e.detail.selectedItem.id)}
                    size="sm"
                />

				<!-- SerGW Specific Settings -->
                {#if selectedService === 'SerGW'}
                    <TextInput labelText="Serial Port" bind:value={serialPort} placeholder="/dev/ttyUSB0" size="sm" />
                    <NumberInput label="Baud Rate" bind:value={baudRate} size="sm" />
                {/if}

				<!-- Hydrand Specific Settings -->
                {#if selectedService === 'Hydrand'}
                    <NumberInput label="Interval (ms)" bind:value={interval} size="sm" />
                    <TextInput labelText="LibSQL URL" bind:value={libsqlUrl} placeholder="http://localhost:8080" size="sm" />
                {/if}

				<!-- Common Settings -->
                <TextInput labelText="Output TCP Address" bind:value={outputAddress} placeholder="127.0.0.1" size="sm" />
                <NumberInput label="Output TCP Port" bind:value={outputPort} size="sm" />

				<!-- Action Buttons -->
                <div>
                    <Button kind="primary" size="small" on:click={startService} disabled={isLoading}>Start Service</Button>
                    <Button kind="danger" size="small" on:click={stopService} disabled={isLoading}>Stop Service</Button>
                    {#if isLoading}
                        <InlineLoading description="Processing..." />
                    {/if}
                </div>
            </Tile>
        </Column>

		<!-- Daemon Logs Card -->
        <Column sm={16} md={8} lg={8}>
            <Tile>
                <div style="display:flex; justify-content: space-between; align-items: center;">
                    <h2>Daemon Logs</h2>
                    <Button kind="ghost" size="small" on:click={fetchDaemonLogs}>Refresh</Button>
                </div>
                {#if logsError}
                    <InlineNotification kind="warning" title="Logs Error" subtitle={logsError} hideCloseButton />
                {/if}
                {#if daemonLogs && daemonLogs.length > 0}
                    <CodeSnippet type="multi" wrapText>
{daemonLogs.join('\n')}
                    </CodeSnippet>
                {:else if !logsError}
                    <p>No logs to display or logs are loading...</p>
                {/if}
            </Tile>
        </Column>
    </Row>
</Grid>
