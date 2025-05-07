<script lang="ts">
	// import { Air, GPS, ImuTemp } from './types';
</script>

<div class="w-full h-full overflow-x-auto">
	<table class="table table-sm table-pin-rows w-full">
		<thead>
			<tr>
				<th>Field</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			<tr class="hover clicky cursor-pointer">
				<td>
					<div class="tooltip tooltip-right" data-tip="Current Pressure of rocket">
						<span class="text-left font-bold">Pressure</span>
					</div>
				</td>
				<td>
					<span class="text-right">{$Air.data?.rocket_sensor_air[0]?.pressure_abs}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<td>
					<div class="tooltip tooltip-right" data-tip="Current Temperature of rocket">
						<span class="text-left">Temperature</span>
					</div>
				</td>
				<td>
					<span class="text-right">{$ImuTemp.data?.rocket_sensor_imu_2[0]?.temperature}</span>
				</td>
			</tr>

			<!-- Altitude and Longitude -->
			<tr class="hover clicky cursor-pointer">
				<td>
					<div class="tooltip tooltip-right" data-tip="Current Longitude of the rocket">
						<span class="text-left font-bold">Longitude</span>
					</div>
				</td>
				<td>
					<span class="text-right">{$GPS.data?.rocket_sensor_gps_pos_1[0]?.longitude}</span>
				</td>
			</tr>

			<!-- Altitude and Latitude -->
			<tr class="hover clicky cursor-pointer">
				<td>
					<div class="tooltip tooltip-right" data-tip="Current Latitude of the rocket">
						<span class="text-left font-bold">Latitude</span>
					</div>
				</td>
				<td>
					<span class="text-right">{$GPS.data?.rocket_sensor_gps_pos_1[0]?.latitude}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<td>
					<div
						class="tooltip tooltip-right"
						data-tip="Current Altitude of the rocket from sea level"
					>
						<span class="text-left font-bold">Air: Altitude</span>
					</div>
				</td>
				<td>
					<span class="text-right">{$Air.data?.rocket_sensor_air[0]?.altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<div
						class="tooltip tooltip-right"
						data-tip="Current Altitude of the rocket from sea level"
					>
						<span class="text-left font-bold">GpsPos: Altitude</span>
					</div>
				</td>
				<td>
					<span class="text-right">
						{$GPS.data?.rocket_sensor_gps_pos_1[0]?.altitude}
					</span></td
				>
			</tr>
		</tbody>
	</table>
</div>
