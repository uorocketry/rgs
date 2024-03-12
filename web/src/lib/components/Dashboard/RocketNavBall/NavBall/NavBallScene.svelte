<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { Quaternion } from 'three';
	import navballfrag from './NavBallShader/fragment.glsl?raw';
	import navballvert from './NavBallShader/vertex.glsl?raw';

	import { useTask } from '@threlte/core';

	const map = useTexture('textures/navball.png');
	map.then((tex) => {
		tex.anisotropy = 32;
		tex.colorSpace = 'srgb-linear';
	});

	export let targetRotation: Quaternion = new Quaternion();

	let displayRotation: Quaternion = targetRotation.clone();

	useTask((delta) => {
		displayRotation = displayRotation.slerp(targetRotation, 5 * delta);
	});
</script>

<T.OrthographicCamera makeDefault={true} position={[0, 0, 10]} zoom={200} />

{#await map then tex}
	<T.Mesh quaternion={[displayRotation.x, displayRotation.y, displayRotation.z, displayRotation.w]}>
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
