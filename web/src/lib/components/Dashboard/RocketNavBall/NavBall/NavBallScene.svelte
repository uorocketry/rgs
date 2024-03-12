<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { PerspectiveCamera, Quaternion } from 'three';

	import { DEG2RAD } from 'three/src/math/MathUtils.js';

	const map = useTexture('textures/navball.png');
	map.then((tex) => {
		tex.anisotropy = 32;
	});

	export let targetRotation: Quaternion = new Quaternion();

	let displayRotation: Quaternion = targetRotation.clone();

	$: invertDisplayRotation = displayRotation.clone().invert();

	let camera: PerspectiveCamera;
	useTask((delta) => {
		displayRotation = displayRotation.slerp(targetRotation, 5 * delta);
	});
</script>

<!-- Camera always follows top of axes -->
<T.PerspectiveCamera
	bind:ref={camera}
	makeDefault
	fov={60}
	position={[0, 4, 0]}
	near={0.1}
	far={1000}
	aspect={1}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
		ref.rotation.z = -DEG2RAD * 90;
	}}
></T.PerspectiveCamera>

<T.PolarGridHelper args={[15, 15, 8, 64]} />

<T.Mesh
	quaternion={[
		invertDisplayRotation.x,
		invertDisplayRotation.y,
		invertDisplayRotation.z,
		invertDisplayRotation.w
	]}
>
	<T.SphereGeometry args={[1, 64, 32]} />
	{#await map then tex}
		<T.MeshStandardMaterial map={tex} />
	{/await}
</T.Mesh>
<T.Mesh position={[0, 1, 0]}>
	<T.SphereGeometry args={[0.05, 10, 2]} />
	<T.MeshStandardMaterial color={[1, 0, 0]} />
</T.Mesh>

<T.AxesHelper
	args={[5]}
	quaternion={[displayRotation.x, displayRotation.y, displayRotation.z, displayRotation.w]}
></T.AxesHelper>
