<script lang="ts">
	import type { LinkStatus, State } from '@rgs/bindings';
	import type { Air } from '@rgs/bindings';
	import type { EkfNav1 } from '@rgs/bindings';
	import type { Imu1 } from '@rgs/bindings';
	import { onCollectionCreated } from '$lib/common/utils';
	import { pb } from '$lib/stores';

	let connection = false;
	let state = '';
	let state_error = false;
	let missed_messages = 0;
	let pressure_abs = 0;
	let altitude = 0;
	let max_altitude = 0;
	let true_airspeed = 0;
	let max_true_air_speed = 0;
	let air_temp = 0;
	let velocity = [0, 0, 0];
	let max_velocity = [0, 0, 0];
	let acc = [0, 0, 0];
	let g_force = 0;
	let max_g_force = 0;

	onCollectionCreated('LinkStatus', (msg: LinkStatus) => {
		connection = msg.connected;
		missed_messages = msg.missed_messages;
	});

	onCollectionCreated('State', (msg: State) => {
		state = msg.status;
		state_error = msg.has_error;
	});

	onCollectionCreated('Air', (msg: Air) => {
		pressure_abs = msg.pressure_abs;
		altitude = msg.altitude;
		true_airspeed = msg.true_airspeed;
		air_temp = msg.air_temperature;
	});

	onCollectionCreated('EkfNav1', (msg: EkfNav1) => {
		velocity = [msg.velocity[0], msg.velocity[1], msg.velocity[2]];
	});

	onCollectionCreated('Imu1', (msg: Imu1) => {
		acc = [msg.accelerometers[0], msg.accelerometers[1], msg.accelerometers[2]];
	});

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

	$: pb.collection('CalculatedMetrics').create({
		max_altitude: max_altitude,
		max_true_air_speed: max_true_air_speed,
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
					<span class="text-left">Connection</span>
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
					<span class="text-left">State Error</span>
				</td>
				<td>
					<span class="text-right">{state_error}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Missed messages</span>
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
					<span class="text-left">Altitude</span>
				</td>
				<td>
					<span class="text-right">{altitude}</span>
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
					<span class="text-left">Airspeed</span>
				</td>
				<td>
					<span class="text-right">{true_airspeed}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max Airspeed</span>
				</td>
				<td>
					<span class="text-right">{max_true_air_speed}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Air Temperature</span>
				</td>
				<td>
					<span class="text-right">{air_temp}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Velocity</span>
				</td>
				<td>
					<span class="text-right">{velocity[0]}</span>
					<span class="text-right">{velocity[1]}</span>
					<span class="text-right">{velocity[2]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max Velocity</span>
				</td>
				<td>
					<span class="text-right">{max_velocity[0]}</span>
					<span class="text-right">{max_velocity[1]}</span>
					<span class="text-right">{max_velocity[2]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Acceleration</span>
				</td>
				<td>
					<span class="text-right">{acc[0]}</span>
					<span class="text-right">{acc[1]}</span>
					<span class="text-right">{acc[2]}</span>
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
