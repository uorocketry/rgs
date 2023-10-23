<script lang="ts">
	import { ekf } from '$lib/realtime/linkStatus';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { tweened } from 'svelte/motion';
	import { Euler, MathUtils, Matrix4, Quaternion, Vector3, type EulerOrder } from 'three';
	import NavBall from '../dumb/NavBall/NavBall.svelte';

	let ninetyDegVerticalRot = new Quaternion();
	let useRocketModel = false;

	ninetyDegVerticalRot.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);

	// Interpolate current rotation to target rotation
	$: latestReportedRotation = new Quaternion();
	const targetRotation = tweened(new Quaternion(0, 0, 0, 1), {
		duration: 300,
		interpolate: (a, b) => {
			return (t) => {
				return a.clone().slerp(b, t).normalize();
			};
		}
	});

	$: eulerRepr = vectorToEuler(
		new Vector3(0, -1, 0).applyQuaternion(latestReportedRotation),
		'XYZ'
	);

	$: {
		const quat = $ekf.quaternion;
		if (quat) {
			latestReportedRotation = new Quaternion(quat[1], quat[2], quat[3], quat[0]);
			// The IMU is placed flat on the rocket, so the up vector is the x axis
			// https://support.sbg-systems.com/sc/qd/latest/reference-manual/conventions
		}
	}

	setInterval(() => {
		targetRotation.set(latestReportedRotation.clone());
	}, 250);

	// Is the up vector pointing above the horizon?
	function upright(quaternion: Quaternion) {
		const upDirection = new Vector3(0, 1, 0);
		const localUpDirection = upDirection.clone().applyQuaternion(quaternion);
		return localUpDirection.y > 0;
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

<div class="z-10 absolute top-2 left-2 variant-glass p-2 grid grid-cols-2">
	<span>Roll</span>
	<span class="text-right">{MathUtils.radToDeg(eulerRepr.x ?? 0).toFixed(2)}°</span>
	<span>Pitch</span>
	<span class="text-right">{MathUtils.radToDeg(eulerRepr.y ?? 0).toFixed(2)}°</span>
	<span>Yaw</span>
	<span class="text-right">{MathUtils.radToDeg(eulerRepr.z ?? 0).toFixed(2)}°</span>
	<span>Pointing</span>
	<span class="text-right">{upright(latestReportedRotation) ? 'Up' : 'Down'}</span>
</div>

<div class="z-10 absolute bottom-2 left-2 variant-glass p-2 flex gap-2 items-center">
	<i class="fa-solid fa-globe"></i>
	<SlideToggle name="slide" bind:checked={useRocketModel}></SlideToggle>
	<i class="fa-solid fa-rocket"></i>
</div>

<div class="z-0 absolute w-full h-full">
	<NavBall targetRotation={$targetRotation} bind:useRocketModel />
</div>
