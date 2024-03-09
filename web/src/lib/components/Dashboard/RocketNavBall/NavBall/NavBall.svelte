<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Quaternion } from 'three/src/Three.js';
	import NavBallScene from './NavBallScene.svelte';
	export let targetRotation: Quaternion = new Quaternion();

	let w = 500;
	let h = 500;
	$: squareSize = Math.min(w - 200, h - 300);
</script>

<div bind:clientHeight={h} bind:clientWidth={w} class="grid place-items-center w-full h-full">
	<div
		class="navball-wrapper"
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

	/* navball wrapper is an auto sized square inside the grid */
	.navball-wrapper {
	}
</style>
