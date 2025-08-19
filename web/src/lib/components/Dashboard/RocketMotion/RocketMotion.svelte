<script lang="ts">
	import { Accelerometers, DeltaV, MaxDeltaV } from './types';
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
					<span class="text-left">ΔV X</span>
				</td>
				<td>
					<span class="text-right">
						{$DeltaV.data?.rocket_sensor_imu_2[0]?.delta_velocity_x}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">ΔV Y</span>
				</td>
				<td>
					<span class="text-right">
						{$DeltaV.data?.rocket_sensor_imu_2[0]?.delta_velocity_y}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">ΔV Z</span>
				</td>
				<td>
					<span class="text-right">
						{$DeltaV.data?.rocket_sensor_imu_2[0]?.delta_velocity_z}
					</span>
				</td>
			</tr>

			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max ΔV X</span>
				</td>
				<td>
					<span class="text-right">
						{$MaxDeltaV.data?.rocket_sensor_imu_2_aggregate.aggregate?.max?.delta_velocity_x}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max ΔV Y</span>
				</td>
				<td>
					<span class="text-right">
						{$MaxDeltaV.data?.rocket_sensor_imu_2_aggregate.aggregate?.max?.delta_velocity_y}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Max ΔV Z</span>
				</td>
				<td>
					<span class="text-right">
						{$MaxDeltaV.data?.rocket_sensor_imu_2_aggregate.aggregate?.max?.delta_velocity_z}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Accel x</span>
				</td>
				<td>
					<span class="text-right">
						{$Accelerometers.data?.rocket_sensor_imu_1[0]?.accelorometer_x}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Accel Y</span>
				</td>
				<td>
					<span class="text-right">
						{$Accelerometers.data?.rocket_sensor_imu_1[0]?.accelorometer_y}
					</span>
				</td>
			</tr>
			<tr class="hover clicky cursor-pointer">
				<td>
					<span class="text-left">Accel Z</span>
				</td>
				<td>
					<span class="text-right">
						{$Accelerometers.data?.rocket_sensor_imu_1[0]?.accelorometer_z}
					</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>
