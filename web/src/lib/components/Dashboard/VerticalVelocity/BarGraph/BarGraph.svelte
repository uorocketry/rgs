<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Chart, registerables } from 'chart.js';
    import { uorocketryTheme } from '$lib/common/uorocketryTheme';
    Chart.register(...registerables);

    export let velocity = 0; // Initial velocity value
    let chart: Chart | null = null;
    let fontString = uorocketryTheme.properties['--theme-font-family-base']

    onMount(() => {
        const ctx = (document.getElementById('myChart') as HTMLCanvasElement)!.getContext('2d');

        // Initial chart setup
        const data = {
            labels: ['Rocket Current Velocity'],
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
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false, // Allow negative values
                        min: -10000, // Set a fixed minimum
                        max: 10000, // Set a fixed maximum
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
                        },
                    },
                    x: {
                        ticks: {
                            font: {
                                    family: fontString 
                            }
                        },
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: fontString   
                            }
                        },
                    
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
        chart.update(); 
    }

    onDestroy(() => {
        chart!.destroy(); // Cleanup on component destroy
    });
</script>

<div class="w-full h-full">
    <canvas id="myChart" class="w-full h-full" ></canvas>
</div>

