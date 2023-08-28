<script lang="ts">
	import type { Imu2 } from '@rgs/bindings';
	import { haversineDistance, onCollectionCreated } from '$lib/common/utils';
	import { pb } from '$lib/stores';
	import { max } from '$lib/common/utils';
	import type { LatLngLiteral } from 'leaflet';
	import { flightDirector, launchPoint } from '$lib/realtime/flightDirector';
	import { air, ekf, imu, linkStatus, state } from '$lib/realtime/linkStatus';
	import { rocketAltitude, rocketPosition } from '$lib/realtime/gps';

	$: connection = $linkStatus?.connected;
	$: stateStr = $state?.status;
	$: missed_messages = $linkStatus?.missed_messages;
	$: pressure_abs = $air?.pressure_abs;
	$: altitude = $air?.altitude;
	let max_altitude = 0;
	$: true_airspeed = 0;
	let max_true_air_speed = 0;
	$: temp = $imu.temperature;
	$: velocity = $ekf.velocity;
	$: target_altitude = $flightDirector.targetAltitude;
	$: relative_altitude = $flightDirector.relativeAltitude;
	let ground_altitude = 0;
	let distance_from_target = 0;
	$: launch_point = [$launchPoint.lat, $launchPoint.lng];
	$: current_position = [$rocketPosition.lat, $rocketPosition.lng, $rocketAltitude];
	let g_force = 0;
	let max_g_force = 0;

	function convertToRadians(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}

	function calcGForce(vf: number, t: number) {
		return vf / (t * 9.81);
	}

	$: g_force = calcGForce(velocity ? velocity[0] : 0, 0.1);
	$: max_g_force = max(max_g_force, g_force);
	$: max_true_air_speed = max(max_true_air_speed, true_airspeed);

	$: max_altitude = max(max_altitude, altitude ?? 0);

	$: ground_altitude = (altitude ?? 0) - relative_altitude;
	$: distance_from_target = target_altitude - ground_altitude;

	$: total_traveled_distance = haversineDistance($rocketPosition, $launchPoint);

	$: pb.collection('CalculatedMetrics').create(
		{
			ground_altitude: ground_altitude,
			distance_from_target: distance_from_target,
			total_traveled_distance: total_traveled_distance,
			max_altitude: max_altitude,
			g_force: g_force,
			max_g_force: max_g_force
		},
		{
			$autoCancel: false
		}
	);
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
					<span class="text-right">{connection ? 'Connected' : 'Disconnected'}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current state of hydra">
					<td>
						<span class="text-left font-bold">State</span>
					</td>
				</div>
				<td>
					<span class="text-right">{stateStr}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Number of missed messages from hydra">
					<td>
						<span class="text-left">Missed Messages</span>
					</td>
				</div>
				<td>
					<span class="text-right">{missed_messages}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Pressure of rocket">
					<td>
						<span class="text-left font-bold">Pressure</span>
					</td>
				</div>
				<td>
					<span class="text-right">{pressure_abs}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Temperature of rocket">
					<td>
						<span class="text-left">Temperature</span>
					</td>
				</div>
				<td>
					<span class="text-right">{temp}</span>
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
					<span class="text-right">{current_position[1]}</span>
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
					<span class="text-right">{current_position[0]}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Altitude of the rocket from sea level">
					<td>
						<span class="text-left font-bold">Air: Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Current Altitude of the rocket from sea level">
					<td>
						<span class="text-left font-bold">GpsPos: Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{current_position[2]}</span>
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
					<span class="text-right">{ground_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="The maximium altitude reached by the rocket">
					<td>
						<span class="text-left font-bold">Max Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{max_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Defined Target Altitude">
					<td>
						<span class="text-left">Target Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{target_altitude}</span>
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
					<span class="text-right">{relative_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="How far are we from the taraget altitude set">
					<td>
						<span class="text-left font-bold">Distance from Target Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{distance_from_target}</span>
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
					<span class="text-right">{total_traveled_distance}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="G force experienced by the rocket">
					<td>
						<span class="text-left">G Force</span>
					</td>
				</div>
				<td>
					<span class="text-right">{g_force}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Max G force experienced by the rocket">
					<td>
						<span class="text-left">Max G Force</span>
					</td>
				</div>
				<td>
					<span class="text-right">{max_g_force}</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>
