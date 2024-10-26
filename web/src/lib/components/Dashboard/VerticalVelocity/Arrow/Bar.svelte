<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Chart, registerables } from 'chart.js';

    // Register Chart.js components
    Chart.register(...registerables);

    export let velocity = 0; // Incoming velocity prop
    let chart: Chart | null = null;

    onMount(() => {
        const ctx = (document.getElementById('myChart') as HTMLCanvasElement)!.getContext('2d');

        // Initial chart setup
        const data = {
            labels: ['Velocity'],
            datasets: [{
                label: `Current Velocity: ${velocity} m/s`, // Dynamic label
                data: [velocity], // Initial velocity value
                backgroundColor: velocity >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)',
                borderColor: velocity >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                barThickness: 50,
            }]
        };

        chart = new Chart(ctx!, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: false, // Allow negative values
                        min: -100, // Set a fixed minimum
                        max: 100, // Set a fixed maximum
                        title: {
                            display: true,
                            text: 'Velocity'
                        }
                    }
                }
            }
        });
    });

    // Reactive update when velocity changes
    $: if (chart) {
        // Update data and colors based on the velocity's value
        chart.data.datasets[0].data[0] = velocity;
        chart.data.datasets[0].label = `Current Velocity: ${velocity} m/s`; // Dynamic label
        chart.data.datasets[0].backgroundColor = velocity >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)';
        chart.data.datasets[0].borderColor = velocity >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
        chart.update(); // Re-render the chart
    }

    onDestroy(() => {
        chart!.destroy(); // Cleanup on component destroy
    });
</script>

<canvas id="myChart" width="400" height="200"></canvas>

<style>
    canvas {
        max-width: 100%;
    }
</style>

<!-- <script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Chart, registerables } from 'chart.js';

    // Register Chart.js components
    Chart.register(...registerables);

    export let velocity = 0; // Incoming velocity prop
    let chart: Chart | null = null;

    // Custom plugin to draw an arrow instead of a bar
    const arrowPlugin = {
        id: 'arrowPlugin',
        afterDatasetsDraw(chart: { data?: any; getDatasetMeta?: any; ctx?: any; }) {
            const { ctx } = chart;
            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0);
            const bar = meta.data[0];
            const { x, y } = bar.tooltipPosition();

            ctx.save();

            // Arrow color based on velocity sign
            ctx.fillStyle = velocity >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
            ctx.strokeStyle = ctx.fillStyle;

            const arrowHeight = 30; // Height of the arrow
            const arrowWidth = 15;  // Width of the arrow head
            const stemWidth = 5;    // Width of the arrow stem

            ctx.beginPath();
            if (velocity >= 0) {
                // Draw upward arrow
                ctx.moveTo(x, y - arrowHeight);          // Top point of the arrowhead
                ctx.lineTo(x - arrowWidth / 2, y);       // Bottom left of the arrowhead
                ctx.lineTo(x - stemWidth / 2, y);        // Left side of the stem
                ctx.lineTo(x - stemWidth / 2, y + arrowHeight);  // Bottom left of the stem
                ctx.lineTo(x + stemWidth / 2, y + arrowHeight);  // Bottom right of the stem
                ctx.lineTo(x + stemWidth / 2, y);        // Right side of the stem
                ctx.lineTo(x + arrowWidth / 2, y);       // Bottom right of the arrowhead
                ctx.closePath();
            } else {
                // Draw downward arrow
                ctx.moveTo(x, y + arrowHeight);          // Bottom point of the arrowhead
                ctx.lineTo(x - arrowWidth / 2, y);       // Top left of the arrowhead
                ctx.lineTo(x - stemWidth / 2, y);        // Left side of the stem
                ctx.lineTo(x - stemWidth / 2, y - arrowHeight);  // Top left of the stem
                ctx.lineTo(x + stemWidth / 2, y - arrowHeight);  // Top right of the stem
                ctx.lineTo(x + stemWidth / 2, y);        // Right side of the stem
                ctx.lineTo(x + arrowWidth / 2, y);       // Top right of the arrowhead
                ctx.closePath();
            }
            ctx.fill();
            ctx.restore();
        }
    };

    onMount(() => {
        const ctx = (document.getElementById('myChart') as HTMLCanvasElement)!.getContext('2d');

        const data = {
            labels: ['Velocity'],
            datasets: [{
                label: `Current Velocity: ${velocity} m/s`, // Dynamic label
                data: [velocity],
            }]
        };

        chart = new Chart(ctx!, {
            type: 'bar',
            data: data,
            options: {
                plugins: [arrowPlugin],
                scales: {
                    y: {
                        beginAtZero: false,
                        min: -100,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Velocity'
                        }
                    }
                }
            }
        });
    });

    $: if (chart) {
        chart.data.datasets[0].data[0] = velocity;
        chart.data.datasets[0].label = `Current Velocity: ${velocity} m/s`;
        chart.update();
    }

    onDestroy(() => {
        chart?.destroy();
    });
</script>

<canvas id="myChart" width="400" height="200"></canvas>

<style>
    canvas {
        max-width: 100%;
    }
</style>
 -->
