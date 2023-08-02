<script lang="ts">
	import { T } from '@threlte/core';
	import { HTML, useTexture } from '@threlte/extras';
	import { Euler, Group, Mesh, MeshBasicMaterial, Quaternion, type EulerOrder } from 'three';
	import { useGltf } from '@threlte/extras';
	import { tweened, type Tweened } from 'svelte/motion';

	const gltf = useGltf('/models/rocket.glb');
	const map = useTexture('textures/navball.png');
	map.then((tex) => {
		tex.anisotropy = 32;
	});

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

	function gltfProcess(e: { ref: Group }) {
		e.ref.traverse((obj) => {
			if (obj.type === 'Mesh') {
				const mesh = obj as Mesh;
				const mat = mesh.material as MeshBasicMaterial;
				mesh.renderOrder = 999;

				if (mat.map) {
					mat.map.anisotropy = 32;
				}
			}
		});
	}
</script>

<T.PerspectiveCamera
	makeDefault
	fov={60}
	position={[0, 35, 0]}
	near={0.1}
	far={100}
	aspect={1}
	on:create={({ ref }) => {
		ref.lookAt(0, 1, 0);
	}}
></T.PerspectiveCamera>

<T.AmbientLight intensity={1} />

<HTML></HTML>

{#await gltf then { scene }}
	<T bind:rotation={rot} is={scene} scale={1} on:create={gltfProcess} />
{/await}

<!-- Old navball -->
<!-- {#await map then tex}
	<T.Mesh bind:rotation={rot}>
		<T.SphereGeometry args={[1, 64, 32]} />
		<T.MeshStandardMaterial map={tex} />
	</T.Mesh>
{/await} -->
