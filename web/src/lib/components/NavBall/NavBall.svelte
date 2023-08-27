<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { Quaternion } from 'three/src/math/Quaternion';
	import NavBallScene from './NavBallScene.svelte';

	export let targetRotation: Quaternion = new Quaternion();

	let clientWidth: number;
	let clientHeight: number;
	export let useRocketModel = false;
	$: minWH = Math.min(clientWidth, clientHeight);
</script>

<div class="w-full h-full grid place-items-center" bind:clientHeight bind:clientWidth>
	{#key clientHeight}
		{#key clientWidth}
			<Canvas size={{ width: minWH, height: minWH }}>
				<NavBallScene bind:targetRotation bind:useRocketModel />
			</Canvas>
		{/key}
	{/key}
</div>
