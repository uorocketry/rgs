<script lang="ts">
	import hydra_provider_logo from '$lib/assets/hydra_provider_logo.svg';
	import { onMount } from 'svelte';

	type Service = {
		name: string;
		logo: string;
		description: string;
		url: string;
		status: 'unknown' | 'ok' | 'error';
	};
	let servicesToCheck: Service[] = [
		{
			name: 'Hydra Provider',
			logo: hydra_provider_logo,
			description: 'Rocket telemetry provider',
			url: '/api/health/hydra_provider',
			status: 'unknown'
		}
	];

	onMount(() => {
		const controller = new AbortController();
		let INTERVAL = 2000;
		for (let service of servicesToCheck) {
			(async () => {
				while (!controller.signal.aborted) {
					try {
						const response = await fetch(service.url, { signal: controller.signal });
						if (response.ok) {
							service.status = 'ok';
						} else {
							service.status = 'error';
						}
					} catch (error) {
						service.status = 'error';
					}
					servicesToCheck = servicesToCheck; // Trigger a re-render
					await new Promise((resolve) => setTimeout(resolve, INTERVAL));
				}
			})();
		}

		return () => {
			controller.abort();
		};
	});
</script>

<main class="p-4 flex flex-col gap-2">
	{#each servicesToCheck as service}
		<div
			class="card bg card-hover p-4 flex items-center
			{service.status === 'unknown'
				? 'variant-filled-warning'
				: service.status === 'ok'
					? 'variant-filled-success'
					: service.status === 'error'
						? 'variant-filled-error'
						: 'var'}"
		>
			<img class="w-12 h-12 mr-4" src={service.logo} alt={service.name} />
			<div>
				<h2 class="text-xl font-bold">{service.name}</h2>
				<p>{service.description}</p>
			</div>
		</div>
	{/each}
</main>
