<script lang="ts">
	import { flightDirector } from '$lib/realtime/flightDirector';
	import { air, imu, linkStatus, state } from '$lib/realtime/linkStatus';
	import {
		current_position,
		distance_from_target,
		g_force,
		ground_altitude,
		max_altitude,
		max_g_force,
		total_traveled_distance
	} from '$lib/realtime/metrics';
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
				<div class="tooltip tooltip-right" data-tip="Radio Connection status with hydra">
					<td>
						<span class="text-left">Radio Connection</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$linkStatus.connected ? 'Connected' : 'Disconnected'}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current state of hydra">
					<td>
						<span class="text-left font-bold">State</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$state.state}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Number of missed messages from hydra">
					<td>
						<span class="text-left">Missed Messages</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$linkStatus.missed_messages}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Pressure of rocket">
					<td>
						<span class="text-left font-bold">Pressure</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$air.pressure_abs}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Temperature of rocket">
					<td>
						<span class="text-left">Temperature</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$imu.temperature}</span>
				</td>
			</tr>

			<!-- Altitude and Longitude -->
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Longitude of the rocket">
					<td>
						<span class="text-left font-bold">Longitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$current_position[1]}</span>
				</td>
			</tr>

			<!-- Altitude and Latitude -->
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Latitude of the rocket">
					<td>
						<span class="text-left font-bold">Latitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$current_position[0]}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Altitude of the rocket from sea level">
					<td>
						<span class="text-left font-bold">Air: Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$air.altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Altitude of the rocket from sea level">
					<td>
						<span class="text-left font-bold">GpsPos: Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$current_position[2]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div
					class="tooltip tooltip-right"
					data-tip="Altitude from where we are from above sea level"
				>
					<td>
						<span class="text-left font-bold">Ground Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$ground_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="The maximium altitude reached by the rocket">
					<td>
						<span class="text-left font-bold">Max Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$max_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Defined Target Altitude">
					<td>
						<span class="text-left">Target Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$flightDirector.targetAltitude ?? '?'}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div
					class="tooltip tooltip-right"
					data-tip="Defined Relative Altitude. How much we are above so level"
				>
					<td>
						<span class="text-left">Relative Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$flightDirector.relativeAltitude ?? '?'}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="How far are we from the taraget altitude set">
					<td>
						<span class="text-left font-bold">Distance from Target Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$distance_from_target}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div
					class="tooltip tooltip-right"
					data-tip="How far have we traveled from the launch point"
				>
					<td>
						<span class="text-left">Total Traveled Distance</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$total_traveled_distance}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="G force experienced by the rocket">
					<td>
						<span class="text-left">G Force</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$g_force}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Max G force experienced by the rocket">
					<td>
						<span class="text-left">Max G Force</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$max_g_force}</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>
