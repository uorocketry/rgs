<script lang="ts">
	import type { EkfNav1, EkfNav2, Imu2, LinkStatus, State, Air, GpsPos1 } from '@rgs/bindings';
	import { onCollectionCreated } from '$lib/common/utils';
	import { pb } from '$lib/stores';
	import { max } from '$lib/common/utils';
	import type { LatLngLiteral } from 'leaflet';
	import { launchPoint } from '$lib/realtime/launchPoint';

	let connection = false;
	let state = '';
	let missed_messages = 0;
	let pressure_abs = 0;
	let altitude = 0;
	let max_altitude = 0;
	let true_airspeed = 0;
	let max_true_air_speed = 0;
	let temp = 0;
	let velocity = [0, 0, 0];
	let target_altitude = 0;
	let relative_altitude = 0;
	let ground_altitude = 0;
	let total_traveled_distance = 0;
	let distance_from_target = 0;
	let launch_point = [0, 0];
	$: current_position = [0, 0, 0];
	let g_force = 0;
	let max_g_force = 0;

	onCollectionCreated('LinkStatus', (msg: LinkStatus) => {
		connection = msg.connected;
		missed_messages = msg.missed_messages;
	});

	onCollectionCreated('State', (msg: State) => {
		state = msg.status;
	});

	onCollectionCreated('Air', (msg: Air) => {
		pressure_abs = msg.pressure_abs;
		altitude = msg.altitude;
	});

	onCollectionCreated('EkfNav1', (msg: EkfNav1) => {
		velocity = [msg.velocity[0], msg.velocity[1], msg.velocity[2]];
	});

	onCollectionCreated('Imu2', (msg: Imu2) => {
		temp = msg.temperature;
	});

	onCollectionCreated('FlightDirector', (msg: any) => {
		if (msg.targetAltitude !== 0) {
			target_altitude = msg.targetAltitude;
		} else if (msg.relativeAltitude !== 0) {
			relative_altitude = msg.relativeAltitude;
		} else if (msg.latitude !== 0) {
			launch_point[0] = msg.latitude;
		} else if (msg.longitude !== 0) {
			launch_point[1] = msg.longitude;
		} else {
			console.log('msg recieved, variable is not defined currently', msg);
		}
	});

	onCollectionCreated('GpsPos1', (msg: GpsPos1) => {
		current_position = [msg.latitude, msg.longitude, msg.altitude];
		console.log('current_position', current_position);
	});

	function convertToRadians(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}

	function calcGForce(vf: number, t: number) {
		return vf / (t * 9.81);
	}

	$: g_force = calcGForce(velocity[1], 1);
	$: max_g_force = max(max_g_force, g_force);
	$: max_true_air_speed = max(max_true_air_speed, true_airspeed);

	$: max_altitude = max(max_altitude, altitude);

	$: ground_altitude = altitude - relative_altitude;
	$: distance_from_target = target_altitude - ground_altitude;

	function latLngDeltaKm(p1: LatLngLiteral, p2: LatLngLiteral) {
		const R = 6371; // Radius of the earth in km
		const dLat = convertToRadians(p2.lat - p1.lat); // deg2rad below
		const dLon = convertToRadians(p2.lng - p1.lng);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(convertToRadians(p1.lat)) *
				Math.cos(convertToRadians(p2.lat)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in km
	}

	$: {
		total_traveled_distance = latLngDeltaKm(
			{
				lat: current_position[0],
				lng: current_position[1]
			},
			$launchPoint
		);
	}

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
					<span class="text-right">{state}</span>
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
				<div class="tooltip tooltip-right" data-tip="Current Temprature of rocket">
					<td>
						<span class="text-left">Temprature</span>
					</td>
				</div>
				<td>
					<span class="text-right">{temp}</span>
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
