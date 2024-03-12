<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Environment } from '@threlte/extras';
	import { Quaternion } from 'three/src/Three.js';
	import NavBallScene from './NavBallScene.svelte';
	export let targetRotation: Quaternion = new Quaternion();
</script>

<div class="flex-1 w-full h-full">
	<Canvas>
		<Environment path={'/textures/cubemap/'} files={'road.hdr'} isBackground={true} />
		<NavBallScene bind:targetRotation />
	</Canvas>
</div>
