import Chart, { type ChartOptions } from 'chart.js/auto';

export function defaultChartOptions(): ChartOptions {
	let color = 'white';
	Chart.defaults.borderColor = 'black';

	return {
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			duration: 200
		},

		plugins: {
			tooltip: {
				mode: 'nearest',
				intersect: false
			}
		},
		// disable element insert animation
		// animation: false,
		elements: {
			line: {
				tension: 0.1
			}
		},

		scales: {
			x: {
				ticks: {
					color: color
				}
			},
			y: {
				ticks: {
					color: color
				}
			}
		}
	};
}
