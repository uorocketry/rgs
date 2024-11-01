<script>
  import BarChart from './BarGraph/BarGraph.svelte';
  import { LatestAltitude } from './types';
  
  $: LatestAltitudeData = $LatestAltitude.data;


  // Previous altitude and velocity
  let latestAltitude = LatestAltitudeData?.rocket_sensor_air[0]?.altitude ?? 0;
  let previousAltitude = latestAltitude;
  let velocity = 0;
  let lastUpdateTime = Date.now(); // Track the last update time

  // Calculate velocity based on altitude change
  $: {
      if (latestAltitude !== previousAltitude) {
          console.log('Latest altitude', latestAltitude);
          const currentTime = Date.now();
          const elapsedTime = (currentTime - lastUpdateTime) / 1000; 
          const altitudeChange = latestAltitude - previousAltitude;

          // Calculate vertical velocity in meters per second
          velocity = altitudeChange / elapsedTime; 
          previousAltitude = latestAltitude;
          lastUpdateTime = currentTime; // Update the last update time
      }
  }

  // Log the calculated velocity
  console.log('Current velocity:', velocity);
</script>

<main>
  <BarChart {velocity} />
</main>
