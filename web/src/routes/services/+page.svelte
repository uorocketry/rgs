<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Grid,
		Row,
		Column,
		Tile,
		Table,
		TableHead,
		TableRow,
		TableHeader,
		TableBody,
		TableCell,
		Button,
		Tag,
		Dropdown,
		TextInput,
		NumberInput,
		InlineLoading,
		CodeSnippet
	} from 'carbon-components-svelte';
	import { toastStore } from '$lib/stores/toastStore';

	type Service = {
		name: string;
		status: 'running' | 'exited' | 'restarting' | 'unknown';
	};

	let services: Service[] = [];
	let loading = false;
	let errorMsg: string | null = null;
	let selectedService: string | null = null;
	let logText = '';
	let logFilter = '';
	let logTail = 50;
	let eventSource: EventSource | null = null;
	let streaming = false;
	let logEl: HTMLElement | null = null;

	async function fetchServices() {
		loading = true;
		errorMsg = null;
		try {
			const res = await fetch('/services/api');
			if (!res.ok) throw new Error(await res.text());
			services = await res.json();
		} catch (err: any) {
			errorMsg = err.message ?? 'Failed to load services';
		} finally {
			loading = false;
		}
	}

	async function action(name: string, op: 'start' | 'stop' | 'restart') {
		loading = true;
		errorMsg = null;
		try {
			const verb = op === 'start' ? 'Start' : op === 'stop' ? 'Stop' : 'Restart';
			const proceed =
				typeof window !== 'undefined' ? window.confirm(`Confirm ${verb} for ${name}?`) : true;
			if (!proceed) return;
			const res = await fetch(
				`/services/api?action=${op}&service=${encodeURIComponent(name)}`,
				{ method: 'POST' }
			);
			if (!res.ok) throw new Error(await res.text());
			await fetchServices();
		} catch (err: any) {
			errorMsg = err.message ?? 'Operation failed';
		} finally {
			loading = false;
		}
	}

	onMount(fetchServices);

	async function fetchLogs() {
		if (!selectedService) return;
		try {
			const params = new URLSearchParams({ service: selectedService, tail: String(logTail) });
			if (logFilter) params.set('grep', logFilter);
			const res = await fetch(`/services/logs/api?${params.toString()}`);
			logText = await res.text();
		} catch (e) {
			logText = 'Failed to fetch logs';
		}
	}

	function startStream() {
		if (!selectedService) return;
		stopStream();
		const params = new URLSearchParams({ service: selectedService, tail: String(logTail) });
		const url = `/services/logs/stream?${params.toString()}`;
		eventSource = new EventSource(url);
		logText = '';
		streaming = true;
		eventSource.onmessage = (ev) => {
			const line = ev.data;
			if (logFilter) {
				try {
					const re = new RegExp(logFilter, 'i');
					if (!re.test(line)) return;
				} catch {}
			}
			logText += (logText ? '\n' : '') + line;
			queueMicrotask(() => {
				logEl?.scrollTo({ top: logEl.scrollHeight });
			});
		};
		eventSource.onerror = () => {
			stopStream();
		};
	}

	function stopStream() {
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
		streaming = false;
	}

	function toggleStream() {
		streaming ? stopStream() : startStream();
	}

	// Dropdown items from services
	$: serviceItems = services.map((s) => ({ id: s.name, text: s.name }));

	// Toast on error changes
	let lastError: string | null = null;
	$: {
		if (errorMsg && errorMsg !== lastError) {
			toastStore.error(`Services: ${errorMsg}`, 0);
		}
		lastError = errorMsg;
	}
</script>

<Grid padding={true}>
	<Row>
		<Column>
			<h1>Service Manager</h1>
		</Column>
	</Row>

	<Row>
		<Column sm={16} md={8} lg={8}>
			<Tile >
				<Table >
					<TableHead >
						<TableRow >
							<TableHeader>Service</TableHeader>
							<TableHeader>Status</TableHeader>
							<TableHeader>Actions</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{#if !loading && services.length === 0}
							<TableRow
								><TableCell>No services found</TableCell><TableCell></TableCell><TableCell
								></TableCell></TableRow
							>
						{:else}
							{#each services as s}
								<TableRow>
									<TableCell>{s.name}</TableCell>
									<TableCell>
										{#if s.status === 'running'}
											<Tag type="green">running</Tag>
										{:else if s.status === 'exited'}
											<Tag type="cool-gray">stopped</Tag>
										{:else if s.status === 'restarting'}
											<Tag type="high-contrast">restarting</Tag>
										{:else}
											<Tag type="gray">unknown</Tag>
										{/if}
									</TableCell>
									<TableCell>
										<div class="action-grid">
											{#if s.status === 'running'}
												<Button size="small" kind="danger" on:click={() => action(s.name, 'stop')}
													>Stop</Button
												>
											{:else}
												<Button
													size="small"
													kind="secondary"
													on:click={() => action(s.name, 'start')}>Start</Button
												>
											{/if}
							<Button size="small" kind="danger" on:click={() => action(s.name, 'restart')} disabled={s.status !== 'running'}
												>Restart</Button
											>
											<Button
												size="small"
												kind="tertiary"
												on:click={() => {
													selectedService = s.name;
													startStream();
												}}>Logs</Button
											>
										</div>
									</TableCell>
								</TableRow>
							{/each}
						{/if}
					</TableBody>
				</Table>
				<Button size="small" kind="primary" on:click={fetchServices} disabled={loading}
					>Refresh</Button
				>
			</Tile>
		</Column>

		<Column sm={16} md={8} lg={8}>
			<Tile>
				<Row>
          <Column >
            <Dropdown
              items={serviceItems}
              selectedId={selectedService}
              titleText="Service"               
              itemToString={(i) => i?.text ?? ''}
              on:select={(e) => {
                selectedService = e.detail.selectedItem?.id ?? null;
              }}
              size="sm"
            />
          </Column>
        
          <Column >
            <TextInput
              labelText="Filter (regex)"        
              bind:value={logFilter}
              placeholder="e.g. error|warn"
              size="sm"
            />
          </Column>
        </Row>
				<Row>
					<Column>
						<NumberInput
							label="Tail lines"
							bind:value={logTail}
							min={10}
							max={500}
							step={5}
							size="sm"
						/>
					</Column>
				</Row>
				<Row>
					<Column>
						<Button size="small" kind="primary" on:click={fetchLogs} disabled={!selectedService}
							>Get logs</Button
						>
						<Button
							size="small"
							kind={streaming ? 'danger' : 'tertiary'}
							on:click={toggleStream}
							disabled={!selectedService}
						>
							{streaming ? 'Stop stream' : 'Start stream'}
						</Button>
					</Column>
				</Row>
				<Row>
					<Column>
						<CodeSnippet type="multi" wrapText>
							{logText}
						</CodeSnippet>
					</Column>
				</Row>
			</Tile>
		</Column>
	</Row>
</Grid>

<svelte:head>
	<style>
		.action-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'main main'
				'left right';
			gap: var(--cds-spacing-02);
		}

		.action-grid > :nth-child(1) {
			grid-area: main;
		}
		.action-grid > :nth-child(2) {
			grid-area: left;
		}
		.action-grid > :nth-child(3) {
			grid-area: right;
		}

		@media (max-width: 768px) {
			.action-grid {
				grid-template-columns: 1fr;
				grid-template-areas:
					'main'
					'left'
					'right';
			}
		}
	</style>
</svelte:head>
