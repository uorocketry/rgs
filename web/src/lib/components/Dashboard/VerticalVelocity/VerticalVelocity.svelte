<script>
  import BarChart from './BarGraph/BarGraph.svelte';
  import { LatestAltitude } from './types';
  
  $: LatestAltitudeData = $LatestAltitude.data;


  // Previous altitude and velocity
  $: latestAltitude = LatestAltitudeData?.rocket_sensor_air[0]?.altitude ?? 0;
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
          lastUpdateTime = currentTime; 
      }
  }

  console.log('Current velocity:', velocity);

  let clientWidth = 0;
	let clientHeight = 0;

	// HACK To force restart of the chart component
	let restart = 0;
	let restartCount = 0;

	$: {
		clientHeight;
		clientWidth;
		restartCount += 1;
		if (restartCount % 2 == 0) {
			restart += 1;
		}
	}

</script>

<main class="h-full w-full" bind:clientWidth bind:clientHeight>
  {#key restart}
  <BarChart {velocity} />
  {/key}
</main>
