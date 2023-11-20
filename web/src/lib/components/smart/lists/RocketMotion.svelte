<script lang="ts">
	import { max_velocity } from '$lib/realtime/metrics';
	import { imu, nav } from '$lib/realtime/sensors';

	let velocity = [0, 0, 0];
	let acc = [0, 0, 0];

	$: velocity = $nav.velocity
		? [$nav.velocity[0], $nav.velocity[1], $nav.velocity[2]]
		: [NaN, NaN, NaN];
	$: acc = $imu.accelerometers
		? [$imu.accelerometers[0], $imu.accelerometers[1], $imu.accelerometers[2]]
		: [NaN, NaN, NaN];
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
				<div class="tooltip tooltip-right" data-tip="Velocity in the x">
					<td>
						<span class="text-left">Velocity 0</span>
					</td>
				</div>
				<td>
					<span class="text-right">{velocity[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Velocity in the y">
					<td>
						<span class="text-left">Velocity 1</span>
					</td>
				</div>
				<td>
					<span class="text-right">{velocity[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Velocity in the z">
					<td>
						<span class="text-left">Velocity 2</span>
					</td>
				</div>
				<td>
					<span class="text-right">{velocity[2]}</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Maximium Veloctiy reached in the x">
					<td>
						<span class="text-left">Max Velocity 0</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$max_velocity[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Maximium Veloctiy reached in the y">
					<td>
						<span class="text-left">Max Velocity 1</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$max_velocity[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Maximium Veloctiy reached in the z">
					<td>
						<span class="text-left">Max Velocity 2</span>
					</td>
				</div>
				<td>
					<span class="text-right">{$max_velocity[2]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Acceleration in the x">
					<td>
						<span class="text-left">Acceleration x</span>
					</td>
				</div>
				<td>
					<span class="text-right">{acc[0]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Acceleration in the y">
					<td>
						<span class="text-left">Acceleration y</span>
					</td>
				</div>
				<td>
					<span class="text-right">{acc[1]}</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<div class="tooltip tooltip-right" data-tip="Acceleration in the z">
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
