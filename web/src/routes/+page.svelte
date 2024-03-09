<script lang="ts">
	import { LatestAltitudeMeasurements } from "./types"
</script>

<div>
	<article class="article">
		<h1>RGS Ground server</h1>

		
		My altitude is {$LatestAltitudeMeasurements.data?.rocket_sensor_air[0]?.altitude}
	</article>
</div>
