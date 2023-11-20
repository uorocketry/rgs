<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, useTexture } from '@threlte/extras';
	import { tweened, type Tweened } from 'svelte/motion';
	import { Euler, Quaternion, type EulerOrder } from 'three';
	import Lazy from '../../smart/Lazy.svelte';
	const map = useTexture('textures/navball.png');
	map.then((tex) => {
		tex.anisotropy = 32;
	});

	export let useRocketModel = false;
	export let targetRotation: Quaternion = new Quaternion();

	let tweenedRotation: Tweened<Quaternion> = tweened(targetRotation, {
		duration: 100,
		interpolate: (a, b) => {
			return (t) => {
				return a.slerp(b, t);
			};
		}
	});

	let targetRotationEuler: Euler = new Euler();
	$: {
		if (targetRotation) {
			targetRotation = targetRotation;
		}
		targetRotationEuler.setFromQuaternion(targetRotation);
		targetRotationEuler = targetRotationEuler;
		tweenedRotation.set(targetRotation);
	}

	let rot: [number, number, number, EulerOrder];
	$: {
		const euler = new Euler().setFromQuaternion($tweenedRotation);
		rot = [euler.x, euler.y, euler.z, 'YZX'];
	}
</script>

<T.PerspectiveCamera
	makeDefault
	fov={60}
	position={[0, 35, 0]}
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
		rotation={rot}
		scale={0.75}
	></Lazy>
{:else}
	{#await map then tex}
		<T.Mesh bind:rotation={rot}>
			<T.SphereGeometry args={[10, 64, 32]} />
			<T.MeshStandardMaterial map={tex} />
		</T.Mesh>
		<T.Mesh position.y="10">
			<T.SphereGeometry args={[0.3, 10, 2]} />
			<T.MeshStandardMaterial color={[1, 0, 1]} />
		</T.Mesh>
	{/await}
{/if}
