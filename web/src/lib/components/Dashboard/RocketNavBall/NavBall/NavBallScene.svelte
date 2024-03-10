<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { tweened, type Tweened } from 'svelte/motion';
	import { Euler, Quaternion, type EulerOrder } from 'three';
	import navballfrag from './NavBallShader/fragment.glsl?raw';
	import navballvert from './NavBallShader/vertex.glsl?raw';

	const map = useTexture('textures/navball.png');
	map.then((tex) => {
		tex.anisotropy = 32;
		tex.colorSpace = 'srgb-linear';
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
</script>

<T.OrthographicCamera makeDefault={true} position={[0, 0, 10]} zoom={200} />

{#await map then tex}
	<T.Mesh bind:rotation={rot}>
		<T.SphereGeometry />
		<T.ShaderMaterial
			fragmentShader={navballfrag}
			vertexShader={navballvert}
			uniforms={{
				uTexture: { value: tex }
			}}
		/>
	</T.Mesh>
{/await}
