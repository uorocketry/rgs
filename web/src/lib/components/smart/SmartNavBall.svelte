<script lang="ts">
	import { Euler, Quaternion, Vector3, type EulerOrder, Matrix4 } from 'three';
	import NavBall from '../NavBall/NavBall.svelte';
	import { MathUtils } from 'three';
	import { onCollectionCreated } from '$lib/common/utils';
	import type { EkfQuat } from '@rgs/bindings';

	let ninetyDegVerticalRot = new Quaternion();
	let useRocketModel = false;

	ninetyDegVerticalRot.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);

	let targetRotation = new Quaternion(0, 0, 0, 1);
	let latestQuat: EkfQuat | undefined = undefined;

	$: upVector = new Vector3(0, 1, 0).applyQuaternion(targetRotation);

	$: adjustedTargetRotation = targetRotation.clone().multiply(ninetyDegVerticalRot);

	let eulerRepr = new Euler();
	eulerRepr.setFromQuaternion(targetRotation);

	onCollectionCreated('EkfQuat', (msg: EkfQuat) => {
		const quat = msg.quaternion;
		latestQuat = msg;
		targetRotation.set(quat[1], quat[2], quat[3], quat[0]);
		targetRotation.normalize();
		targetRotation = targetRotation;
		// The IMU is placed flat on the rocket, so the up vector is the x axis
		// https://support.sbg-systems.com/sc/qd/latest/reference-manual/conventions
		const baseVec = new Vector3(0, -1, 0).applyQuaternion(targetRotation);
		// eulerRepr is derived from upVector
		eulerRepr = vectorToEuler(baseVec, 'XYZ');
	});

	// Is the up vector pointing above the horizon?
	function upright(quaternion: Quaternion) {
		const upDirection = new Vector3(0, 1, 0);
		const localUpDirection = upDirection.clone().applyQuaternion(quaternion);
		return localUpDirection.y > 0;
	}

	function adjustedPitch(quaternion: Quaternion) {
		const upDirection = new Vector3(0, 1, 0);
		const localUpDirection = upDirection.clone().applyQuaternion(quaternion);
		const dotProduct = localUpDirection.dot(upDirection);
		const angle = Math.acos(dotProduct);
		return angle;
	}

	function vectorToEuler(direction: Vector3, eulerOrder: EulerOrder = 'XYZ'): Euler {
		// Create a clone of the direction vector
		const directionClone = direction.clone();

		// Create a 'up' vector
		const up = new Vector3(0, 1, 0);

		// Create a 'right' vector
		const right = new Vector3().crossVectors(up, directionClone).normalize();

		// Recompute the 'up' vector
		up.crossVectors(directionClone, right).normalize();

		// Create a rotation matrix
		const rotationMatrix = new Matrix4().makeBasis(right, up, directionClone);

		// Create a Euler and set the order of rotation
		const rotation = new Euler().setFromRotationMatrix(rotationMatrix, eulerOrder);

		return rotation;
	}
</script>

<div class="w-full h-full p-2 flex flex-col">
	<div>
		<!-- <div class=" flex flex-wrap">
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
		</div> -->

		<!-- <div class="flex">
			<span class="flex-1">Quat (W,X,Y,Z)</span>
			<span class="flex-1">{targetRotation.w.toFixed(2)}</span>
			<span class="flex-1">{targetRotation.x.toFixed(2)}</span>
			<span class="flex-1">{targetRotation.y.toFixed(2)}</span>
			<span class="flex-1">{targetRotation.z.toFixed(2)}</span>
		</div> -->

		<!-- Pitch yaw row -->
		<div class="grid grid-cols-2">
			<span>Roll</span>
			<span class="text-right">{MathUtils.radToDeg(eulerRepr.x ?? 0).toFixed(2)}°</span>
			<span>Pitch</span>
			<span class="text-right">{MathUtils.radToDeg(eulerRepr.y ?? 0).toFixed(2)}°</span>
			<span>Yaw</span>
			<span class="text-right">{MathUtils.radToDeg(eulerRepr.z ?? 0).toFixed(2)}°</span>
			<span>Pointing</span>
			<span class="text-right">{upright(targetRotation) ? 'Up' : 'Down'}</span>
		</div>
	</div>

	<div class="flex-1 overflow-hidden">
		<NavBall bind:targetRotation bind:useRocketModel />
	</div>
</div>

<!-- Abs bottom left  radio to control useROcketmodel-->
<div class="absolute bottom-0 left-0 p-2">
	<div class="join">
		<input
			class="join-item btn"
			type="radio"
			name="options"
			aria-label="NavBall"
			on:click={() => (useRocketModel = false)}
		/>
		<input
			class="join-item btn"
			type="radio"
			name="options"
			aria-label="Rocket"
			on:click={() => (useRocketModel = true)}
		/>
	</div>
</div>
