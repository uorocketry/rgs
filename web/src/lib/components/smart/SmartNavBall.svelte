<script lang="ts">
	import { Euler, Quaternion } from 'three';
	import NavBall from '../NavBall.svelte';
	import { MathUtils } from 'three';
	import { onCollectionCreated } from '$lib/common/utils';
	import type { EkfQuat } from '@rgs/bindings';

	let targetRotation = new Quaternion();
	let latestQuat: EkfQuat | undefined = undefined;
	targetRotation.set(0, 0, 0, 1);

	let eulerRepr = new Euler(0, 0, 0, 'XYZ');
	eulerRepr.setFromQuaternion(targetRotation);

	onCollectionCreated('EkfQuat', (msg: EkfQuat) => {
		const quat = msg.quaternion;
		latestQuat = msg;

		targetRotation.set(quat[1], quat[2], quat[3], quat[0]);
		targetRotation = targetRotation;
		eulerRepr.setFromQuaternion(targetRotation);
		eulerRepr = eulerRepr;
	});
</script>

<div class="w-full h-full p-2 flex flex-col">
	<div>
		<div class=" flex flex-wrap">
			<button
				class="btn btn-sm flex-1"
				on:click={() => navigator.clipboard.writeText(JSON.stringify(targetRotation))}
			>
				Copy Quat
			</button>

			<button
				class="btn btn-sm flex-1"
				on:click={() => navigator.clipboard.writeText(JSON.stringify(eulerRepr.toArray()))}
			>
				Copy Euler
			</button>
		</div>

		<div class="flex">
			<span class="flex-1">Quat</span>
			<span class="flex-1">{targetRotation.x.toFixed(2)}</span>
			<span class="flex-1">{targetRotation.y.toFixed(2)}</span>
			<span class="flex-1">{targetRotation.z.toFixed(2)}</span>
			<span class="flex-1">{targetRotation.w.toFixed(2)}</span>
		</div>

		<!-- Pitch yaw row -->
		<div class="grid grid-cols-2">
			<span>Roll</span>
			<span class="text-right"
				>{MathUtils.radToDeg(latestQuat?.euler_std_dev[0] ?? 0).toFixed(2)}°</span
			>
			<span>Pitch</span>
			<span class="text-right"
				>{MathUtils.radToDeg(latestQuat?.euler_std_dev[1] ?? 0).toFixed(2)}°</span
			>
			<span>Yaw</span>
			<span class="text-right"
				>{MathUtils.radToDeg(latestQuat?.euler_std_dev[2] ?? 0).toFixed(2)}°</span
			>
		</div>
	</div>

	<div class="flex-1 overflow-hidden">
		<NavBall bind:targetRotation />
	</div>
</div>
