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

	type Item = { id: number; kind: 'State' | 'Event'; value: string; ts: number | null };

	let items: Item[] = [];
	let connected = false;
	let error: string | null = null;
	let eventSource: EventSource | null = null;

	function connect() {
		try {
			const es = new EventSource('/state/api');
			eventSource = es;
			connected = true;
			error = null;

			es.addEventListener('snapshot', (e: MessageEvent) => {
				try {
					items = JSON.parse(e.data) as Item[];
				} catch {}
			});

			es.addEventListener('append', (e: MessageEvent) => {
				try {
					const newItems = JSON.parse(e.data) as Item[];
					items = [...newItems, ...items].slice(0, 100);
				} catch {}
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
				<Tag>{items[0] ? formatTs(items[0].ts) : 'Waiting…'}</Tag>
				{#if !connected}
					<InlineLoading description={error ?? 'Connecting…'} />
				{/if}
			</h1>
		</Column>
	</Row>

	<Row>
		<Column>
			<Tile>
				<h3>Latest</h3>
				{#if items[0]}
					<p>
						<Tag type={items[0].kind === 'State' ? 'green' : 'cyan'}>{items[0].kind}</Tag>
						<Tag>{items[0].value}</Tag>
						<span> {formatTs(items[0].ts)}</span>
					</p>
				{:else}
					<p>No data yet…</p>
				{/if}
			</Tile>
		</Column>
	</Row>

	<Row>
		<Column>
			<Tile>
				<h3>Recent State changes</h3>
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader>ID</TableHeader>
							<TableHeader>State</TableHeader>
							<TableHeader>Timestamp</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{#each items.filter((i) => i.kind === 'State') as it (it.id)}
							<TableRow>
								<TableCell>{it.id}</TableCell>
								<TableCell><Tag type="green">{it.value}</Tag></TableCell>
								<TableCell>{formatTs(it.ts)}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</Tile>
		</Column>
		<Column>
			<Tile>
				<h3>Recent Event changes</h3>
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader>ID</TableHeader>
							<TableHeader>Event</TableHeader>
							<TableHeader>Timestamp</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{#each items.filter((i) => i.kind === 'Event') as it (it.id)}
							<TableRow>
								<TableCell>{it.id}</TableCell>
								<TableCell><Tag type="cyan">{it.value}</Tag></TableCell>
								<TableCell>{formatTs(it.ts)}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</Tile>
		</Column>
	</Row>
</Grid>
