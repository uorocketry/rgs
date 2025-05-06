<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { uorocketryTheme } from '$lib/common/uorocketryTheme';
	Chart.register(...registerables);

	export let velocity = 0;
	let chart: Chart | null = null;
	let fontString = uorocketryTheme.properties['--theme-font-family-base'];

	onMount(() => {
		const ctx = (document.getElementById('myChart') as HTMLCanvasElement)!.getContext('2d');

		// Initial chart setup
		const data = {
			labels: ['Rocket Current Velocity'],
			datasets: [
				{
					label: `Current Vertical Velocity: ${velocity.toFixed(2)} m/s`,
					data: [velocity],
					backgroundColor: velocity >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)',
					borderColor: velocity >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
					barThickness: 50
				}
			]
		};

		chart = new Chart(ctx!, {
			type: 'bar',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: false, // Allow negative values
						min: -10000,
						max: 10000,
						title: {
							display: true,
							text: 'Velocity (m/s)',
							font: {
								family: fontString
							}
						},
						ticks: {
							font: {
								family: fontString
							}
						}
					},
					x: {
						ticks: {
							font: {
								family: fontString
							}
						}
					}
				},
				plugins: {
					legend: {
						labels: {
							font: {
								family: fontString
							}
						}
					}
				}
			}
		});
	});

	// Reactive update when velocity changes
	$: if (chart) {
		chart.data.datasets[0].data[0] = velocity;
		chart.data.datasets[0].label = `Current Vertical Velocity: ${velocity.toFixed(2)} m/s`;
		chart.data.datasets[0].backgroundColor =
			velocity >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)';
		chart.data.datasets[0].borderColor =
			velocity >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
		chart.update();
	}

	onDestroy(() => {
		chart!.destroy();
	});
</script>

<div class="w-full h-full">
	<canvas id="myChart" class="w-full h-full"></canvas>
</div>
