<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Environment } from '@threlte/extras';
	import { Quaternion } from 'three/src/Three.js';
	import NavBallScene from './NavBallScene.svelte';
	export let targetRotation: Quaternion = new Quaternion();

	let w = 500;
	let h = 500;
	$: squareSize = Math.min(w - 80, h - 160);
</script>

<div bind:clientHeight={h} bind:clientWidth={w} class="grid place-items-center w-full h-full">
	<div
		class="navball-wrapper relative"
		style="
	width: {squareSize}px;
	height: {squareSize}px;
"
	>
		<Canvas
			size={{
				height: 500,
				width: 500
			}}
		>
			<Environment path={'/textures/cubemap/'} files={'road.hdr'} isBackground={true} />

			<NavBallScene bind:targetRotation />
		</Canvas>
	</div>
</div>

<style>
	:global(.navball-wrapper canvas) {
		min-width: 100%;
		min-height: 100%;
		max-width: 100%;
		max-height: 100%;
	}
</style>
