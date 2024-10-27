<script>
    import BarChart from './BarGraph/BarGraph.svelte';
    import { onDestroy } from 'svelte';
  
    // Initial velocity value
    let velocity = 0;
  
    // Function to simulate velocity updates (randomly change velocity between -50 and +50)
    function updateVelocity() {
      velocity = Math.floor(Math.random() * 100) - 50;
    }
  
    // Update velocity every 2 seconds
    const interval = setInterval(updateVelocity, 2000);
  
    // Clear interval when component is destroyed
    onDestroy(() => clearInterval(interval));
  </script>
  
  <main>
    <BarChart {velocity} />
  </main>
  
