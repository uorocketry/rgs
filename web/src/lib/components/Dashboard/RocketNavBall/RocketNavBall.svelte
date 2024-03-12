<script lang="ts">
	import { MathUtils, Quaternion, Vector3 } from 'three';
	import HeadingCompass from './HeadingCompass/HeadingCompass.svelte';
	import NavBall from './NavBall/NavBall.svelte';
	import { RocketQuat } from './types';

	let ninetyDegVerticalRot = new Quaternion();

	ninetyDegVerticalRot.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);

	// Interpolate current rotation to target rotation
	$: rocketData = $RocketQuat.data;
	$: quatData =
		rocketData?.rocket_message[0].rocket_sensor_message?.rocket_sensor_quat?.data_quaternion;
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

	// Get the pitch and roll from the quaternion
	$: upTransformed = new Vector3(0, 1, 0).applyQuaternion(latestReportedRotation);
	$: pitch = MathUtils.radToDeg(Math.asin(upTransformed.y));

	$: heading =
		(MathUtils.radToDeg(Math.atan2(upTransformed.x, upTransformed.z)) + 360 + 180 + 90) % 360;

	$: transformed = new Vector3(0, 0, -1).applyQuaternion(latestReportedRotation);
	$: roll = MathUtils.radToDeg(Math.atan2(transformed.x, transformed.z) + Math.PI);
</script>

<div class="z-10 absolute top-2 left-2 variant-glass p-2 grid grid-cols-2 text-dark-token">
	<span>Roll</span>
	<span class="text-right">{roll.toFixed(2)}°</span>
	<span>Pitch</span>
	<span class="text-right">{pitch.toFixed(2)}°</span>
	<span>Heading</span>
	<span class="text-right">{heading.toFixed(2)}°</span>

	<span>Pointing</span>
	<span class="text-right">{pitch > 0 ? 'Up' : 'Down'}</span>
</div>

<div class="absolute bg-black h-full w-full"></div>

<div class="z-0 absolute inset-0">
	<NavBall targetRotation={latestReportedRotation} />
</div>

<div class="z-0 absolute h-full w-full">
	<HeadingCompass {heading} />
</div>
