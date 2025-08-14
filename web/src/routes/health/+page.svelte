<script lang="ts">
	import { gsap } from 'gsap';
	import type { PageData } from './$types';
// Carbon Charts
	import { HeatmapChart, ScaleTypes, type BarChartOptions, type HeatmapChartOptions } from '@carbon/charts-svelte';
	import '@carbon/charts-svelte/styles.min.css';
// Carbon Components
	import { toastStore } from '$lib/stores/toastStore';
	import {
		Column,
		Grid,
		InlineLoading,
		Row,
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
		Tag,
		Tile
	} from 'carbon-components-svelte';
	import { carbonTheme } from '$lib/common/theme';
	import { get } from 'svelte/store';

	let { data } = $props<{ data: PageData }>();

	// Configuration
	const DEFAULT_NUM_BARS = 20;
	const DEFAULT_HISTORY_MINUTES = 10;
	const REFRESH_INTERVAL_MS = 30 * 1000;
	const EXPECTED_SERVICES = [
		{ id: 'hydrand', name: 'Hydrand' },
		{ id: 'telemetry-ingestor', name: 'Telemetry Ingestor' }
	];

	// Types
	type HealthServiceHistory = {
		service_id: string;
		hostname: string | null;
		latest_app_timestamp: number | null;
		latest_db_timestamp: number | null;
		latency_secs: number | null;
		status: 'Operational' | 'Outage';
		history: boolean[];
	};

	type HealthApiResponse = {
		checkTime: string;
		parameters: {
			historyMinutes: number;
			numBuckets: number;
			bucketDurationSeconds: number;
			operationalThresholdSeconds: number;
		};
		services: HealthServiceHistory[];
	};

	// State
	let currentHealthData = $state<HealthApiResponse | null>(
		data.initialHealthData as HealthApiResponse | null
	);
	let isLoading = $state(false);
	let errorMessage = $state<string | null>(null);
	let progressPercent = $state(0);
	let lastFetchStartTime = $state(Date.now());
	let progressAnimation: gsap.core.Tween | null = null;
	let eventSource: EventSource | null = null;

	// Derived State
	let serviceStatuses = $derived(
		EXPECTED_SERVICES.map((expected) => {
			const apiData = currentHealthData?.services?.find((s) => s.service_id === expected.id);
			const numBars = currentHealthData?.parameters?.numBuckets ?? DEFAULT_NUM_BARS;

			if (apiData) {
				// Data found in API response
				return {
					...expected,
					status: apiData.status,
					lastSeen: apiData.latest_db_timestamp,
					details: apiData,
					history: apiData.history
				};
			} else {
				// Service expected but not found
				return {
					...expected,
					status: 'Outage' as const,
					lastSeen: null,
					details: null,
					history: Array(numBars).fill(false)
				};
			}
		})
	);

	let overallStatus = $derived(
		(() => {
			if (!currentHealthData)
				return { text: 'Some Systems Experiencing Issues', alertClass: 'alert-error' };
			const hasOutage = serviceStatuses.some((s) => s.status === 'Outage');

			if (hasOutage) return { text: 'Some Systems Experiencing Issues', alertClass: 'alert-error' };
			return { text: 'All Systems Operational', alertClass: 'alert-success' };
		})()
	);

	// Notify on overall status changes via toast API
	let lastOverallKind = $state<'success' | 'error' | null>(null);
	$effect(() => {
		const kind: 'success' | 'error' =
			overallStatus.alertClass === 'alert-success' ? 'success' : 'error';
		if (lastOverallKind !== null && lastOverallKind !== kind) {
			if (kind === 'success') {
				toastStore.success(overallStatus.text, 5000);
			} else {
				toastStore.error(overallStatus.text, 5000);
			}
		}
		lastOverallKind = kind;
	});

	// Toast on API errors instead of inline notification
	let lastErrorMessage = $state<string | null>(null);
	$effect(() => {
		if (errorMessage && errorMessage !== lastErrorMessage) {
			toastStore.error(`Error Loading Status: ${errorMessage}`, 0);
		}
		lastErrorMessage = errorMessage;
	});

	// Chart data preparation (bar chart retained for reference) and heatmap
	let uptimeChartData = $state<
		Array<{
			group: string;
			timeframe: string;
			status: string;
			value: number;
			timestamp: number;
		}>
	>([]);

    let heatmapData = $state<Array<{ service: string; bucket: string; value: number }>>([]);
    const serviceNames = $derived(serviceStatuses.map((s) => s.name));

	// removed gaugeData

	// Update chart data when service statuses change
	$effect(() => {
        if (!currentHealthData) {
            uptimeChartData = [];
            heatmapData = [];
            return;
        }

		const numBars = currentHealthData.parameters.numBuckets;
		const historyMinutes = currentHealthData.parameters.historyMinutes;
		const bucketDurationMs = (historyMinutes * 60 * 1000) / numBars;
		const now = new Date();

		uptimeChartData = serviceStatuses.flatMap((service) => {
			return service.history.map((isOperational, index) => {
				const startTime = new Date(now.getTime() - (numBars - index) * bucketDurationMs);
				const endTime = new Date(startTime.getTime() + bucketDurationMs);

				return {
					group: service.name,
					timeframe: `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
					status: isOperational ? 'Operational' : 'Outage',
					value: isOperational ? 1 : 0,
					timestamp: startTime.getTime()
				};
			});
		});

        heatmapData = serviceStatuses.flatMap((service) => {
			return service.history.map((isOperational, index) => {
				const startTime = new Date(now.getTime() - (numBars - index) * bucketDurationMs);
                const endTime = new Date(startTime.getTime() + bucketDurationMs);
                const label = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}-${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
                return { service: service.name, bucket: label, value: isOperational ? 1 : 0 };
			});
		});

		// removed gauge percentage computation
	});

	// Chart options

    const heatmapOptions: HeatmapChartOptions = $derived({
		title: 'Service Uptime (Heatmap)',
		height: '320px',
        theme: get(carbonTheme),
		heatmap: {
			divider: { state: 'auto' },
            colorLegend: { title: 'Uptime' }
		},
		color: {
			scale: { 0: '#da1e28', 1: '#24a148' }
		},
		legend: { enabled: false },
		axes: {
            left: { mapsTo: 'service', scaleType: ScaleTypes.LABELS },
            bottom: { mapsTo: 'bucket', scaleType: ScaleTypes.LABELS }
		}
	});


	// Effects
	$effect(() => {
		function startProgressAnimation() {
			if (progressAnimation) progressAnimation.kill();
			lastFetchStartTime = Date.now();
			progressPercent = 0;
			progressAnimation = gsap.to({}, {
				duration: REFRESH_INTERVAL_MS / 1000,
				ease: 'none',
				onUpdate: function () { progressPercent = this.progress() * 100; }
			});
		}

		function connectSSE() {
			if (eventSource) {
				eventSource.close();
				eventSource = null;
			}
			startProgressAnimation();
			const es = new EventSource('/health/api?sse=1');
			eventSource = es;
			isLoading = true;
			es.addEventListener('health', (e: MessageEvent) => {
				try {
					currentHealthData = JSON.parse(e.data) as HealthApiResponse;
					errorMessage = null;
					isLoading = false;
					startProgressAnimation();
				} catch {}
			});
			es.addEventListener('error', () => {
				isLoading = false;
			});
		}

		connectSSE();
		return () => {
			if (eventSource) eventSource.close();
			if (progressAnimation) progressAnimation.kill();
		};
	});

	// Helpers
	function formatTimestamp(epochSeconds: number | null): string {
		if (epochSeconds === null) return 'N/A';
		return new Date(epochSeconds * 1000).toLocaleString();
	}

	function getStatusTagType(status: 'Operational' | 'Outage'): 'green' | 'red' {
		return status === 'Operational' ? 'green' : 'red';
	}
</script>

<svelte:head>
	<title>Service Health Status</title>
</svelte:head>

<Grid padding={true}>
    <Row>
        <Column>
            <h1 class="cds--type-productive-heading-03">
                Service Health Status
                <Tag>Last updated: {currentHealthData?.checkTime
                    ? new Date(currentHealthData.checkTime).toLocaleString()
                    : 'N/A'}</Tag>
                {#if isLoading}
                    <InlineLoading description="Updating..." />
                {/if}
            </h1>
        </Column>
    </Row>

	<Row>
		<Column>
			<Tile class="h-full">
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader>Service</TableHeader>
							<TableHeader>Status</TableHeader>
							<TableHeader>Last Seen</TableHeader>
							<TableHeader>Hostname</TableHeader>
							<TableHeader>Latency (s)</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{#each serviceStatuses as service (service.id)}
							<TableRow>
								<TableCell>{service.name}</TableCell>
								<TableCell>
									<Tag type={getStatusTagType(service.status)} >
										{service.status}
									</Tag>
								</TableCell>
								<TableCell>{formatTimestamp(service.lastSeen)}</TableCell>
								<TableCell>{service.details ? service.details.hostname || '-' : '-'}</TableCell>
								<TableCell>{service.details && service.details.latency_secs != null ? service.details.latency_secs : '-'}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</Tile>
		</Column>
	</Row>

	<Row>
		<Column>
			<Tile>
				{#if heatmapData.length > 0}
					<HeatmapChart  data={heatmapData} options={heatmapOptions} />
				{:else}
					<InlineLoading description="Loading chart..." />
				{/if}
			</Tile>
		</Column>
	</Row>
</Grid>
