<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { Quaternion } from 'three/src/math/Quaternion';
	import NavBallScene from './NavBallScene.svelte';

	export let targetRotation: Quaternion = new Quaternion();

	let clientWidth: number;
	let clientHeight: number;
	$: minWH = Math.min(clientWidth, clientHeight);
</script>

<div class="w-full h-full grid place-items-center" bind:clientHeight bind:clientWidth>
	{#key clientHeight}
		{#key clientWidth}
			<Canvas size={{ width: minWH, height: minWH }}>
				<NavBallScene bind:targetRotation />
			</Canvas>
		{/key}
	{/key}
</div>
