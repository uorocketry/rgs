<script lang="ts">
	// CSS
	import '../app.css';
	import '../leaflet.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import 'chart.js/auto'; // Import everything from chart.js
	import Header from '$lib/components/Header.svelte';
	import MasterCommandBox from '$lib/components/commandPallete/MasterCommandBox.svelte';
	import { onMount } from 'svelte';
	import { startLayout } from '$lib/common/layoutStore';

	onMount(() => {
		startLayout();
	});
</script>

<div id="wrapper" class="wrapper">
	<MasterCommandBox />
	<header>
		<Header />
	</header>

	<slot />
</div>

<style>
	.wrapper {
		position: fixed;
		display: flex;
		flex-flow: column;
		height: 100%;
		width: 100%;
		min-height: 100%;
		margin: 0px auto;
		padding: 0px auto;
	}

	header {
		flex: 0 1 auto;
		z-index: 1;
	}

	main {
		position: relative;
		bottom: 0;
		flex: 1 1 auto;
	}
</style>
