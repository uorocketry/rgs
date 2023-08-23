<script lang="ts">
	import type { EkfNav1, EkfNav2, Imu1, Imu2, LinkStatus, State, Air } from '@rgs/bindings';
	import { onCollectionCreated } from '$lib/common/utils';
	import { pb } from '$lib/stores';
	import { max } from '$lib/common/utils';

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
	let current_position = [0, 0, 0];
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

	onCollectionCreated('EkfNav2', (msg: EkfNav2) => {
		current_position = [msg.position[0], msg.position[1], msg.position[2]];
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
	$: {
		let traveled_distance = 0;
		let dlon = convertToRadians(current_position[0] - launch_point[0]);
		let dlat = convertToRadians(current_position[1] - launch_point[1]);
		let a =
			Math.sin(dlat / 2) ** 2 +
			Math.cos(launch_point[1]) * Math.cos(current_position[1]) * Math.sin(dlon / 2) ** 2;
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		traveled_distance = 6371 * c;
		total_traveled_distance = traveled_distance;
	}

	$: pb.collection('CalculatedMetrics').create({
		ground_altitude: ground_altitude,
		distance_from_target: distance_from_target,
		total_traveled_distance: total_traveled_distance,
		max_altitude: max_altitude,
		g_force: g_force,
		max_g_force: max_g_force
	});
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
				<div class="tooltip tooltip-top" data-tip="Radio Connection status with hydra">
					<td>
						<span class="text-left">Radio Connection</span>
					</td>
				</div>
				<td>
					<span class="text-right">{connection ? 'Connected' : 'Disconnected'}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Current state of hydra">
					<td>
						<span class="text-left">State</span>
					</td>
				</div>
				<td>
					<span class="text-right">{state}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Number of missed messages from hydra">
					<td>
						<span class="text-left">Missed Messages</span>
					</td>
				</div>
				<td>
					<span class="text-right">{missed_messages}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Current Pressure of rocket">
					<td>
						<span class="text-left">Pressure</span>
					</td>
				</div>
				<td>
					<span class="text-right">{pressure_abs}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Current Temprature of rocket">
					<td>
						<span class="text-left">Temprature</span>
					</td>
				</div>
				<td>
					<span class="text-right">{temp}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltio-top" data-tip="Current Altitude of the rocket from sea level">
					<td>
						<span class="text-left">Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div
					class="tooltip tooltip-top"
					data-tip="Defined Target Altitude, use Ctrl + p to get to define it"
				>
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
					class="tooltip tooltip-top"
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
				<div class="tooltip tooltip-top" data-tip="Altitude from where we are from above sea level">
					<td>
						<span class="text-left">Ground Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{ground_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="The maximium altitude reached by the rocket">
					<td>
						<span class="text-left">Max Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{max_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="How far are we from the taraget altitude set">
					<td>
						<span class="text-left">Distance from Target Altitude</span>
					</td>
				</div>
				<td>
					<span class="text-right">{distance_from_target}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="How far have we traveled from the launch point">
					<td>
						<span class="text-left">Total Traveled Distance</span>
					</td>
				</div>
				<td>
					<span class="text-right">{total_traveled_distance}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="G force experienced by the rocket">
					<td>
						<span class="text-left">G Force</span>
					</td>
				</div>
				<td>
					<span class="text-right">{g_force}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Max G force experienced by the rocket">
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
