<script lang="ts">
	import { writable } from 'svelte/store';
	import { DeltaV, MaxDeltaV, Accelerometers } from './types';
	// import { max_velocity } from '$lib/realtime/metrics';
	// import { imu, nav } from '$lib/realtime/sensors';

	let acc = [0, 0, 0];

	// $: velocity = $nav.velocity
	// 	? [$nav.velocity[0], $nav.velocity[1], $nav.velocity[2]]
	// 	: [NaN, NaN, NaN];
	// $: acc = $imu.accelerometers
	// 	? [$imu.accelerometers[0], $imu.accelerometers[1], $imu.accelerometers[2]]
	// 	: [NaN, NaN, NaN];

	// Use sample values
	$: acc = [4, 5, 6];
	let max_velocity = writable([0, 0, 0]);
</script>

<!-- <div class="z-0 absolute w-full h-full">
	<NavBall targetRotation={$targetRotation} bind:useRocketModel />
</div> -->

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
					<span class="text-left">ΔV X</span>
				</td>
				<td>
					<span class="text-right">
						{$DeltaV.data?.rocket_sensor_imu_2[0]?.dataVec3ByDeltaVelocity.x}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">ΔV Y</span>
				</td>
				<td>
					<!-- <span class="text-right">{velocity[1]}</span> -->
					<span class="text-right">
						{$DeltaV.data?.rocket_sensor_imu_2[0]?.dataVec3ByDeltaVelocity.y}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">ΔV Z</span>
				</td>
				<td>
					<span class="text-right">
						{$DeltaV.data?.rocket_sensor_imu_2[0]?.dataVec3ByDeltaVelocity.z}
					</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max ΔV X</span>
				</td>
				<td>
					<span class="text-right">
						{$MaxDeltaV.data?.data_vec3_aggregate.aggregate?.max?.x}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max ΔV Y</span>
				</td>
				<td>
					<span class="text-right">
						{$MaxDeltaV.data?.data_vec3_aggregate.aggregate?.max?.y}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max ΔV Z</span>
				</td>
				<td>
					<span class="text-right">
						{$MaxDeltaV.data?.data_vec3_aggregate.aggregate?.max?.z}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Accel x</span>
				</td>
				<td>
					<span class="text-right">
						{$Accelerometers.data?.rocket_sensor_imu_1[0].data_vec3ByAccelerometers.x}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Accel Y</span>
				</td>
				<td>
					<span class="text-right">
						{$Accelerometers.data?.rocket_sensor_imu_1[0].data_vec3ByAccelerometers.y}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Accel Z</span>
				</td>
				<td>
					<span class="text-right">
						{$Accelerometers.data?.rocket_sensor_imu_1[0].data_vec3ByAccelerometers.z}
					</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>
