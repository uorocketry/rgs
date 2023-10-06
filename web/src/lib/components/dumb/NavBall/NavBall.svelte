<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Sky } from '@threlte/extras';
	import { Quaternion } from 'three/src/Three.js';
	import NavBallScene from './NavBallScene.svelte';
	export let targetRotation: Quaternion = new Quaternion();

	export let useRocketModel = false;
</script>

<div class="flex-1 w-full h-full">
	<Canvas>
		<Sky />
		<NavBallScene bind:targetRotation bind:useRocketModel />
	</Canvas>
</div>
