<script lang="ts">
	import type { EkfNav2, Imu2, LinkStatus, State } from '@rgs/bindings';
	import type { Air } from '@rgs/bindings';
	import type { EkfNav1 } from '@rgs/bindings';
	import type { Imu1 } from '@rgs/bindings';
	import { onCollectionCreated } from '$lib/common/utils';
	import { pb } from '$lib/stores';

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
	let max_velocity = [0, 0, 0];
	let acc = [0, 0, 0];
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

	onCollectionCreated('Imu1', (msg: Imu1) => {
		acc = [msg.accelerometers[0], msg.accelerometers[1], msg.accelerometers[2]];
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

	pb.collection('CalculatedMetrics').create(
		{
			ground_altitude: ground_altitude,
			distance_from_target: distance_from_target,
			total_traveled_distance: total_traveled_distance
		},
		{
			$autoCancel: false
		}
	);

	function max(a: number, b: number) {
		return a > b ? a : b;
	}

	function calcGForce(vf: number, t: number) {
		return vf / (t * 9.81);
	}

	$: g_force = calcGForce(velocity[1], 1);
	$: max_g_force = max(max_g_force, g_force);
	$: max_true_air_speed = max(max_true_air_speed, true_airspeed);
	$: max_velocity = [
		max(max_velocity[0], velocity[0]),
		max(max_velocity[1], velocity[1]),
		max(max_velocity[2], velocity[2])
	];
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
		max_altitude: max_altitude,
		max_velocity_1: max_velocity[0],
		max_velocity_2: max_velocity[1],
		max_velocity_3: max_velocity[2],
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
				<td>
					<span class="text-left">Radio Connection</span>
				</td>
				<td>
					<span class="text-right">{connection ? 'Connected' : 'Disconnected'}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">State</span>
				</td>
				<td>
					<span class="text-right">{state}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Missed Messages</span>
				</td>
				<td>
					<span class="text-right">{missed_messages}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Pressure</span>
				</td>
				<td>
					<span class="text-right">{pressure_abs}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Temprature</span>
				</td>
				<td>
					<span class="text-right">{temp}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Altitude</span>
				</td>
				<td>
					<span class="text-right">{altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Target Altitude</span>
				</td>
				<td>
					<span class="text-right">{target_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Relative Altitude</span>
				</td>
				<td>
					<span class="text-right">{relative_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Ground Altitude</span>
				</td>
				<td>
					<span class="text-right">{ground_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max Altitude</span>
				</td>
				<td>
					<span class="text-right">{max_altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Velocity 0</span>
				</td>
				<td>
					<span class="text-right">{velocity[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Velocity 1</span>
				</td>
				<td>
					<span class="text-right">{velocity[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Velocity 2</span>
				</td>
				<td>
					<span class="text-right">{velocity[2]}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max Velocity 0</span>
				</td>
				<td>
					<span class="text-right">{max_velocity[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max Velocity 1</span>
				</td>
				<td>
					<span class="text-right">{max_velocity[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max Velocity 2</span>
				</td>
				<td>
					<span class="text-right">{max_velocity[2]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Acceleration x</span>
				</td>
				<td>
					<span class="text-right">{acc[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Acceleration y</span>
				</td>
				<td>
					<span class="text-right">{acc[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Acceleration z</span>
				</td>
				<td>
					<span class="text-right">{acc[2]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Distance from Target Altitude</span>
				</td>
				<td>
					<span class="text-right">{distance_from_target}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Total Traveled Distance</span>
				</td>
				<td>
					<span class="text-right">{total_traveled_distance}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">G Force</span>
				</td>
				<td>
					<span class="text-right">{g_force}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max G Force</span>
				</td>
				<td>
					<span class="text-right">{max_g_force}</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>
