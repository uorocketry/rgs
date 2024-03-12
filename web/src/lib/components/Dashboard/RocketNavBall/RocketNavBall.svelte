<script lang="ts">
	// import { quat } from '$lib/realtime/sensors';
	import Timeline from '$lib/components/Common/Timeline/Timeline.svelte';
	import { Euler, MathUtils, Matrix4, Quaternion, Vector3, type EulerOrder } from 'three';
	import NavBall from './NavBall/NavBall.svelte';
	import { RocketQuat } from './types';

	let ninetyDegVerticalRot = new Quaternion();

	ninetyDegVerticalRot.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);

	// Interpolate current rotation to target rotation
	$: quatData =
		$RocketQuat.data?.rocket_message[0].rocket_sensor_message?.rocket_sensor_quat?.data_quaternion;
	$: quatDataOrIdentity = {
		x: quatData?.x ?? 0,
		y: quatData?.y ?? 0,
		z: quatData?.z ?? 0,
		w: quatData?.w ?? 1
	};
	$: latestReportedRotation = new Quaternion(
		quatDataOrIdentity.y,
		quatDataOrIdentity.z,
		quatDataOrIdentity.x,
		quatDataOrIdentity.w
	);

	$: eulerRepr = vectorToEuler(
		new Vector3(0, -1, 0).applyQuaternion(latestReportedRotation),
		'XYZ'
	);

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

<div class="z-0 absolute w-full h-full">
	<NavBall targetRotation={latestReportedRotation} />
</div>
