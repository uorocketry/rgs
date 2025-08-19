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

	type Item = {
		id: number;
		kind: 'State' | 'Event';
		value: string;
		ts: number | null;
		duration_s: number | null;
	};

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
					const newItems = JSON.parse(e.data) as Item[];
					// Deduplicate items by id and timestamp to prevent key conflicts
					const seen = new Set<string>();
					items = newItems.filter((item) => {
						const key = `${item.id}-${item.ts}`;
						if (seen.has(key)) return false;
						seen.add(key);
						return true;
					});
				} catch {}
			});

			es.addEventListener('append', (e: MessageEvent) => {
				try {
					const newItems = JSON.parse(e.data) as Item[];
					// Deduplicate and merge new items
					const seen = new Set<string>();
					const existingKeys = new Set(items.map((item) => `${item.id}-${item.ts}`));

					const uniqueNewItems = newItems.filter((item) => {
						const key = `${item.id}-${item.ts}`;
						if (seen.has(key) || existingKeys.has(key)) return false;
						seen.add(key);
						return true;
					});

					items = [...uniqueNewItems, ...items].slice(0, 100);
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

	function formatDuration(seconds: number | null): string {
		if (seconds == null || !isFinite(seconds)) return '—';
		const s = Math.max(0, Math.floor(seconds));
		const hrs = Math.floor(s / 3600);
		const mins = Math.floor((s % 3600) / 60);
		const secs = s % 60;
		if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
		if (mins > 0) return `${mins}m ${secs}s`;
		return `${secs}s`;
	}

	// Create unique keys for each items to prevent Svelte key conflicts
	function getUniqueKey(item: Item, index: number): string {
		return `${item.id}-${item.ts}-${index}`;
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
							<TableHeader>Duration</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{#each items.filter((i) => i.kind === 'State') as it, index (getUniqueKey(it, index))}
							<TableRow>
								<TableCell>{it.id}</TableCell>
								<TableCell><Tag type="green">{it.value}</Tag></TableCell>
								<TableCell>{formatTs(it.ts)}</TableCell>
								<TableCell>{formatDuration(it.duration_s)}</TableCell>
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
							<TableHeader>Duration</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{#each items.filter((i) => i.kind === 'Event') as it, index (getUniqueKey(it, index))}
							<TableRow>
								<TableCell>{it.id}</TableCell>
								<TableCell><Tag type="cyan">{it.value}</Tag></TableCell>
								<TableCell>{formatTs(it.ts)}</TableCell>
								<TableCell>{formatDuration(it.duration_s)}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</Tile>
		</Column>
	</Row>
</Grid>
