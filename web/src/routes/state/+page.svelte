<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Grid,
		Row,
		Column,
		Tile,
		Tag,
		InlineLoading,
		Table,
		TableHead,
		TableRow,
		TableHeader,
		TableBody,
		TableCell
	} from 'carbon-components-svelte';

	type StateUpdate = { id: number; state: string; ts: number | null };

	let current: StateUpdate | null = null;
	let history: StateUpdate[] = [];
	let connected = false;
	let error: string | null = null;
	let eventSource: EventSource | null = null;

	function connect() {
		try {
			const es = new EventSource('/state/api');
			eventSource = es;
			connected = true;
			error = null;

			es.addEventListener('state', (e: MessageEvent) => {
				try {
					const data = JSON.parse(e.data) as StateUpdate;
					current = data;
					history = [data, ...history].slice(0, 50);
				} catch (err) {
					console.error('Failed to parse state payload', err);
				}
			});

			es.onerror = (e) => {
				console.error('SSE error', e);
				connected = false;
				error = 'Connection lost';
				es.close();
			};
		} catch (e) {
			error = 'Failed to connect';
			connected = false;
		}
	}

	onMount(connect);
	onDestroy(() => eventSource?.close());

	function formatTs(ts: number | null): string {
		if (!ts) return 'N/A';
		const d = new Date(ts * 1000);
		return d.toLocaleString();
	}
</script>

<svelte:head>
	<title>Flight State</title>
</svelte:head>

<Grid padding={true}>
	<Row>
		<Column>
			<h1 class="cds--type-productive-heading-03">
				Flight State
				{#if current}
					<Tag>{formatTs(current.ts)}</Tag>
				{:else}
					<Tag>Waiting…</Tag>
				{/if}
				{#if !connected}
					<InlineLoading description={error ?? 'Connecting…'} />
				{/if}
			</h1>
		</Column>
	</Row>

	<Row>
		<Column>
			<Tile>
				{#if current}
					<p>
						Current: <Tag type="green">{current.state}</Tag>
					</p>
				{:else}
					<p>No state yet…</p>
				{/if}
			</Tile>
		</Column>
	</Row>

	<Row>
		<Column>
			<Tile>
				<h3>Recent changes</h3>
				{#if history.length === 0}
					<p>—</p>
				{:else}
					<Table>
						<TableHead>
							<TableRow>
								<TableHeader>ID</TableHeader>
								<TableHeader>State</TableHeader>
								<TableHeader>Timestamp</TableHeader>
							</TableRow>
						</TableHead>
						<TableBody>
							{#each history as h (h.id)}
								<TableRow>
									<TableCell>{h.id}</TableCell>
									<TableCell><Tag>{h.state}</Tag></TableCell>
									<TableCell>{formatTs(h.ts)}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Tile>
		</Column>
	</Row>
</Grid>
