<script lang="ts">
	import type { LinkStatus, State } from '@rgs/bindings';
	import type { Air } from '@rgs/bindings';
	import type { EkfNav1 } from '@rgs/bindings';
	import type { Imu1 } from '@rgs/bindings';
	import { onCollectionCreated } from '$lib/common/utils';

	let connection = false;
	let state = '';
	let state_error = false;
	let missed_messages = 0;
	let pressure_abs = 0;
	let altitude = 0;
	let true_airspeed = 0;
	let air_temp = 0;
	let velocity = [0, 0, 0];
	let acc = [0, 0, 0];

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

	// $: current_radio_msg = radio_msg[radio_msg.length - 1];
	// $: current_rocket_msg = rocket_msg[rocket_msg.length - 1];
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
			<!-- {#if current_radio_msg && current_rocket_msg} -->
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
					<span class="text-left">missed messages</span>
				</td>
				<td>
					<span class="text-right">{missed_messages}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">pressure</span>
				</td>
				<td>
					<span class="text-right">{pressure_abs}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">altitude</span>
				</td>
				<td>
					<span class="text-right">{altitude}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">airspeed</span>
				</td>
				<td>
					<span class="text-right">{true_airspeed}</span>
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
					<span class="text-left">Acceleration</span>
				</td>
				<td>
					<span class="text-right">{acc[0]}</span>
					<span class="text-right">{acc[1]}</span>
					<span class="text-right">{acc[2]}</span>
				</td>
			</tr>
			<!-- {/if} -->
		</tbody>
	</table>
</div>
