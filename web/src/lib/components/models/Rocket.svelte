<script>
	import { T, forwardEventHandlers } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import { Group } from 'three';

	export const ref = new Group();

	const gltf = useGltf('models/rocket.glb', { useDraco: true });

	const component = forwardEventHandlers();
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
	{#await gltf}
		<slot name="fallback" />
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.body.geometry}
			material={gltf.materials.Wrap_Upper}
			position={[0, -15, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.fins.geometry}
			material={gltf.materials.Zinc}
			position={[0, -15, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.nozzle.geometry}
			material={gltf.materials.Slate}
			position={[0, -15, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.cone.geometry}
			material={gltf.materials['Red Paint']}
			position={[0, -15, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.cone_tip.geometry}
			material={gltf.materials.Slate}
			position={[0, -15, 0]}
		/>
	{:catch error}
		<slot name="error" {error} />
	{/await}

	<slot {ref} />
</T>
