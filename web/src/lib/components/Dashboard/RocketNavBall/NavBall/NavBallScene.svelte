<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, useTexture } from '@threlte/extras';
	import { Quaternion, Vector3 } from 'three';
	import Lazy from '../../../Common/Lazy.svelte';

	import { spring } from 'svelte/motion';

	const map = useTexture('textures/navball.png');
	map.then((tex) => {
		tex.anisotropy = 32;
	});

	export let useRocketModel = false;

	export let targetRotation: Quaternion = new Quaternion();

	let springRotation = spring({
		x: targetRotation.x,
		y: targetRotation.y,
		z: targetRotation.z,
		w: targetRotation.w
	});

	$: springRotation.set({
		x: targetRotation.x,
		y: targetRotation.y,
		z: targetRotation.z,
		w: targetRotation.w
	});

	$: transformedUpPos = new Vector3(0, 1, 0)
		.clone()
		.applyQuaternion(
			new Quaternion($springRotation.x, $springRotation.y, $springRotation.z, $springRotation.w)
		);
</script>

<T.PerspectiveCamera
	makeDefault
	fov={60}
	position={[-0.01, 5, 0]}
	near={0.1}
	far={1000}
	aspect={1}
	on:create={({ ref }) => {
		ref.lookAt(0, 1, 0);
	}}
>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.PolarGridHelper args={[15, 15, 8, 64]} />

{#if useRocketModel}
	<Lazy
		this={async () => (await import('$lib/components/models/Rocket.svelte')).default}
		scale={0.75}
	></Lazy>
{:else}
	{#await map then tex}
		<T.Mesh>
			<T.SphereGeometry args={[1, 64, 32]} />
			<T.MeshStandardMaterial map={tex} />
		</T.Mesh>
		<T.Mesh position={[0, 0, 3]}>
			<T.SphereGeometry args={[0.1, 10, 2]} />
			<T.MeshStandardMaterial color={[1, 0, 0]} />
		</T.Mesh>
	{/await}
{/if}

<T.AxesHelper
	args={[5]}
	quaternion={[$springRotation.x, $springRotation.y, $springRotation.z, $springRotation.w]}
></T.AxesHelper>

<T.ArrowHelper
	args={[
		new Vector3(transformedUpPos.x, transformedUpPos.y, transformedUpPos.z),
		new Vector3(0, 0, 0),
		5,
		0x00ff00
	]}
></T.ArrowHelper>
