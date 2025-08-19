<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Grid,
		Row,
		Column,
		Tile,
		Button,
		InlineNotification,
		InlineLoading,
		Tag
	} from 'carbon-components-svelte';

	import { LineChart } from '@carbon/charts-svelte';
	import type { ChartTabularData, LineChartOptions } from '@carbon/charts-svelte';
	import { ScaleTypes } from '@carbon/charts';

	type LatestSnapshot = {
		barometer: {
			ts: number;
			pressure_kpa: number;
			temperature_celsius: number | null;
			altitude_m: number;
		} | null;
		sbgAir: { ts: number; pressure_pa: number; pressure_kpa: number; altitude_m: number } | null;
		gnss: { ts: number; altitude_m: number } | null;
	};

	let error: string | null = $state(null);
	let loading = $state(false);
	let connected = $state(false);
	let eventSource: EventSource | null = null;
	let latest: LatestSnapshot | null = $state(null);
	import { findSetting } from '$lib/common/settings';
	const altitudeMinutesSetting = findSetting('flight.altitudeMinutes');
	import { get } from 'svelte/store';
	// QNH is not user-configurable in this page; hardcode to 102.5 kPa
	let qnhKpa = $state(102.5);
	let minutesBack = $state(
		altitudeMinutesSetting && altitudeMinutesSetting.valueDescription === 'number'
			? Number(get(altitudeMinutesSetting.value))
			: 15
	);

	let chartData: ChartTabularData = $state([]);
	const chartOptions: LineChartOptions = {
		title: 'Altitude Over Time',
		axes: {
			left: { title: 'Altitude (m)', mapsTo: 'value', scaleType: ScaleTypes.LINEAR },
			bottom: { title: 'Time', mapsTo: 'date', scaleType: ScaleTypes.TIME }
		},
		curve: 'curveMonotoneX',
		legend: { enabled: true },
		grid: { x: { enabled: true }, y: { enabled: true } },
		height: '400px',
		toolbar: { enabled: false }
	};

	function formatTs(ts: number | null | undefined): string {
		if (!ts || !Number.isFinite(ts)) return 'N/A';
		try {
			return new Date(ts * 1000).toLocaleString();
		} catch {
			return 'N/A';
		}
	}

	async function refresh() {
		loading = true;
		try {
			const res = await fetch(`/altitude/api?minutes=${encodeURIComponent(minutesBack)}`);
			if (!res.ok) throw new Error(await res.text());
			const body = await res.json();
			latest = body.latest;
			chartData = body.series?.data ?? [];
			error = null;
		} catch (e: any) {
			error = e.message || 'Failed to fetch data';
		} finally {
			loading = false;
		}
	}

	function startSSE() {
		if (eventSource) eventSource.close();
		eventSource = new EventSource(`/altitude/api?sse=1&minutes=${encodeURIComponent(minutesBack)}`);
		connected = false;
		loading = true;
		eventSource.onopen = () => {
			connected = true;
			loading = false;
			error = null;
		};
		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				latest = data.latest;
				chartData = data.series?.data ?? [];
				console.log('chartData sample', chartData?.[0]);
			} catch (e) {
				console.error('Error parsing event data', e);
				/* ignore */
			}
		};
		eventSource.addEventListener('altitude', (event) => {
			try {
				const data = JSON.parse(event.data);
				latest = data.latest;
				chartData = data.series?.data ?? [];
			} catch {
				/* ignore */
			}
		});
		eventSource.onerror = () => {
			connected = false;
			loading = false;
		};
	}

	function stopSSE() {
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
		connected = false;
	}

	onMount(() => {
		startSSE();
	});
	onDestroy(() => {
		stopSSE();
	});
</script>

<Grid padding={true}>
	<Row>
		<Column>
			<Tile>
				<div style="display: flex; justify-content: space-between; align-items: center;">
					<h2>Altitude</h2>
					<div>
						<Button
							kind="secondary"
							size="default"
							on:click={refresh}
							disabled={loading}
							title="Refresh"
						>
							{#if loading}
								<InlineLoading description="Refreshing..." />
							{:else}
								Refresh
							{/if}
						</Button>
						{#if connected}
							<Button
								kind="danger"
								size="default"
								on:click={stopSSE}
								style="margin-left: 0.5rem;"
								title="Stop Live">Stop Live</Button
							>
						{:else}
							<Button
								kind="primary"
								size="default"
								on:click={startSSE}
								style="margin-left: 0.5rem;"
								title="Start Live">Start Live</Button
							>
						{/if}
					</div>
				</div>

				{#if error}
					<InlineNotification
						kind="error"
						title="Error"
						subtitle={error}
						hideCloseButton
						style="margin: 1rem 0;"
					/>
				{/if}

				{#if connected}
					<InlineNotification
						kind="success"
						title="Connected"
						subtitle="Receiving real-time updates"
						hideCloseButton
						style="margin: 1rem 0;"
					/>
				{/if}

				<Row style="margin: 1rem 0;">
					<Column>
						<Tile>
							<h3>Barometer</h3>
							{#if latest?.barometer}
								<div style="font-size: 1.25rem;">{formatTs(latest.barometer.ts)}</div>
								<div style="font-size: 2rem; font-weight: bold;">
									{latest.barometer.altitude_m.toFixed(1)} m
								</div>
								<Tag type="blue" size="sm">{latest.barometer.pressure_kpa.toFixed(3)} kPa</Tag>
							{:else}
								<div style="font-size: 2rem; font-weight: bold; color: gray;">N/A</div>
							{/if}
						</Tile>
					</Column>
					<Column>
						<Tile>
							<h3>SBG Air</h3>
							{#if latest?.sbgAir}
								<div style="font-size: 1.25rem;">{formatTs(latest.sbgAir.ts)}</div>
								<div style="font-size: 2rem; font-weight: bold;">
									{latest.sbgAir.altitude_m.toFixed(1)} m
								</div>
								<Tag type="teal" size="sm">{latest.sbgAir.pressure_kpa.toFixed(3)} kPa</Tag>
							{:else}
								<div style="font-size: 2rem; font-weight: bold; color: gray;">N/A</div>
							{/if}
						</Tile>
					</Column>
					<Column>
						<Tile>
							<h3>GNSS Altitude</h3>
							{#if latest?.gnss}
								<div style="font-size: 1.25rem;">{formatTs(latest.gnss.ts)}</div>
								<div style="font-size: 2rem; font-weight: bold;">
									{latest.gnss.altitude_m.toFixed(1)} m
								</div>
								<Tag type="green" size="sm">GPS</Tag>
							{:else}
								<div style="font-size: 2rem; font-weight: bold; color: gray;">N/A</div>
							{/if}
						</Tile>
					</Column>
				</Row>

				<Tile>
					<LineChart data={chartData} options={chartOptions} />
				</Tile>
			</Tile>
		</Column>
	</Row>
</Grid>
