<script lang="ts">
	import type { PageData } from './$types';
	import { gsap } from 'gsap';

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
	let dataFetchIntervalId: ReturnType<typeof setInterval> | null = null;
	let progressAnimation: gsap.core.Tween | null = null;

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

	// Effects
	$effect(() => {
		function startProgressAnimation() {
			if (progressAnimation) progressAnimation.kill();
			lastFetchStartTime = Date.now();
			progressPercent = 0;

			progressAnimation = gsap.to(
				{},
				{
					duration: REFRESH_INTERVAL_MS / 1000,
					ease: 'none',
					onUpdate: function () {
						progressPercent = this.progress() * 100;
					}
				}
			);
		}

		async function fetchHealthData() {
			if (isLoading) return;
			isLoading = true;
			startProgressAnimation();

			try {
				const response = await fetch('/health/api');
				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`API Error ${response.status}: ${response.statusText || errorText}`);
				}
				currentHealthData = (await response.json()) as HealthApiResponse;
				errorMessage = null;
			} catch (err: any) {
				console.error('Error fetching health data on client:', err);
				errorMessage = err.message || 'An unknown error occurred';
			} finally {
				isLoading = false;
			}
		}

		if (!currentHealthData && !errorMessage) {
			fetchHealthData();
		} else {
			startProgressAnimation();
		}
		dataFetchIntervalId = setInterval(fetchHealthData, REFRESH_INTERVAL_MS);

		// Cleanup
		return () => {
			if (dataFetchIntervalId) clearInterval(dataFetchIntervalId);
			if (progressAnimation) progressAnimation.kill();
		};
	});

	// Helpers
	function formatTimestamp(epochSeconds: number | null): string {
		if (epochSeconds === null) return 'N/A';
		return new Date(epochSeconds * 1000).toLocaleString();
	}

	// Return DaisyUI badge classes based on service status
	function getStatusBadgeClass(status: 'Operational' | 'Outage'): string {
		return status === 'Operational' ? 'badge-success' : 'badge-error';
	}

	// Return DaisyUI background classes based on history data point
	function getBarColor(isOperational: boolean): string {
		return isOperational ? 'bg-success' : 'bg-base-300';
	}

	function formatTimeHM(date: Date): string {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	}

	function getBarTimeFrame(index: number, numBars: number, historyMinutes: number): string {
		const now = new Date();
		const bucketDurationMs = (historyMinutes * 60 * 1000) / numBars;
		const start = new Date(now.getTime() - (numBars - index) * bucketDurationMs);
		const end = new Date(start.getTime() + bucketDurationMs);
		return `[${formatTimeHM(start)} - ${formatTimeHM(end)}]`;
	}
</script>

<svelte:head>
	<title>Service Health Status</title>
</svelte:head>

<div class="container mx-auto p-4 md:p-8">
	<div role="alert" class="alert {overallStatus.alertClass} mb-6 shadow-md">
		{#if overallStatus.alertClass === 'alert-success'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
		{:else if overallStatus.alertClass === 'alert-error'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current shrink-0 w-6 h-6"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path></svg
			>
		{/if}
		<span class="text-lg font-semibold">{overallStatus.text}</span>
	</div>

	{#if isLoading && !currentHealthData}
		<p class="text-center text-base-content opacity-70 my-8">Loading initial status...</p>
	{:else if errorMessage}
		<div role="alert" class="alert alert-error mb-6 shadow-md">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<div>
				<strong class="font-bold">Error Loading Status:</strong>
				<span class="block sm:inline">{errorMessage}</span>
			</div>
		</div>
	{/if}

	<div class="mb-4">
		<div class="flex justify-end items-center text-sm text-base-content opacity-70 mb-1">
			Last updated: {currentHealthData?.checkTime
				? new Date(currentHealthData.checkTime).toLocaleString()
				: 'N/A'}
			{#if isLoading}<span class="ml-2 animate-pulse">(Updating...)</span>{/if}
			<span class="ml-4"
				>Refreshing in {Math.max(
					0,
					Math.round((REFRESH_INTERVAL_MS / 1000) * (1 - progressPercent / 100))
				)}s</span
			>
		</div>
		<progress class="progress progress-info w-full h-1" max="100" value={progressPercent}
		></progress>
	</div>

	<div class="space-y-6">
		{#each serviceStatuses as service (service.id)}
			{@const numBars = service.history.length || DEFAULT_NUM_BARS}
			{@const historyMinutes =
				currentHealthData?.parameters?.historyMinutes ?? DEFAULT_HISTORY_MINUTES}
			<div class="card bg-base-100 shadow-md border border-base-300">
				<div class="card-body p-4">
					<div class="flex justify-between items-center mb-2">
						<h3 class="card-title text-lg text-base-content">{service.name}</h3>
						<span class="badge {getStatusBadgeClass(service.status)}">
							{service.status}
						</span>
					</div>

					<div class="mb-2">
						<div class="flex space-x-px" title={`Uptime over the last ${historyMinutes} minutes`}>
							{#each { length: numBars } as _, i}
								{@const historyIndex = i}
								{@const isUp = service.history[historyIndex] ?? false}
								<div
									class="h-8 flex-1 {getBarColor(isUp)} rounded-sm tooltip tooltip-top"
									data-tip={getBarTimeFrame(historyIndex, numBars, historyMinutes)}
								></div>
							{/each}
						</div>
						<div class="flex justify-between text-xs text-base-content opacity-60 mt-1">
							<span>{historyMinutes} min ago</span>
							<span>Now</span>
						</div>
					</div>

					<div
						class="text-xs text-base-content opacity-70 flex justify-between items-center border-t border-base-200 pt-2 mt-2"
					>
						<span>Last seen: {formatTimestamp(service.lastSeen)}</span>
						{#if service.details}
							<span title="Hostname / Latency">
								{service.details.hostname || '-'} / {service.details.latency_secs ?? '-'}s
							</span>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<footer class="mt-8 text-center text-sm text-base-content opacity-60">
		<!-- <a href="/health/history" class="hover:underline">View historical uptime</a> -->
	</footer>
</div>
