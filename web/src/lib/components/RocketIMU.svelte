<script lang="ts">
	import type { EkfNav1, EkfNav2, Imu1, Imu2, LinkStatus, State, Air } from '@rgs/bindings';
	import { max, onCollectionCreated } from '$lib/common/utils';
	import { pb } from '$lib/stores';

	let velocity = [0, 0, 0];
	let max_velocity = [0, 0, 0];
	let acc = [0, 0, 0];

	onCollectionCreated('EkfNav1', (msg: EkfNav1) => {
		velocity = [msg.velocity[0], msg.velocity[1], msg.velocity[2]];
	});

	onCollectionCreated('Imu1', (msg: Imu1) => {
		acc = [msg.accelerometers[0], msg.accelerometers[1], msg.accelerometers[2]];
	});

	$: max_velocity = [
		max(max_velocity[0], velocity[0]),
		max(max_velocity[1], velocity[1]),
		max(max_velocity[2], velocity[2])
	];

	$: pb.collection('CalculatedMetrics').create({
		max_velocity_1: max_velocity[0],
		max_velocity_2: max_velocity[1],
		max_velocity_3: max_velocity[2]
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
				<div class="tooltip tooltip-top" data-tip="Velocity in the x">
					<td>
						<span class="text-left">Velocity 0</span>
					</td>
				</div>
				<td>
					<span class="text-right">{velocity[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Velocity in the y">
					<td>
						<span class="text-left">Velocity 1</span>
					</td>
				</div>
				<td>
					<span class="text-right">{velocity[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Velocity in the z">
					<td>
						<span class="text-left">Velocity 2</span>
					</td>
				</div>
				<td>
					<span class="text-right">{velocity[2]}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Maximium Veloctiy reached in the x">
					<td>
						<span class="text-left">Max Velocity 0</span>
					</td>
				</div>
				<td>
					<span class="text-right">{max_velocity[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Maximium Veloctiy reached in the y">
					<td>
						<span class="text-left">Max Velocity 1</span>
					</td>
				</div>
				<td>
					<span class="text-right">{max_velocity[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Maximium Veloctiy reached in the z">
					<td>
						<span class="text-left">Max Velocity 2</span>
					</td>
				</div>
				<td>
					<span class="text-right">{max_velocity[2]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Acceleration in the x">
					<td>
						<span class="text-left">Acceleration x</span>
					</td>
				</div>
				<td>
					<span class="text-right">{acc[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Acceleration in the y">
					<td>
						<span class="text-left">Acceleration y</span>
					</td>
				</div>
				<td>
					<span class="text-right">{acc[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-top" data-tip="Acceleration in the z">
					<td>
						<span class="text-left">Acceleration z</span>
					</td>
				</div>
				<td>
					<span class="text-right">{acc[2]}</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>
