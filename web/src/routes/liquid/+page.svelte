<script lang="ts">
	import { Grid } from '@threlte/extras';

	let valveStates = {
		valve1: false,
		valve2: false
	};

	// Simulate receiving valve states from Arduino
	function updateValveStates(newStates) {
		valveStates = { ...valveStates, ...newStates };
	}

	setInterval(() => {
		updateValveStates({
			valve1: Math.random() > 0.5,
			valve2: Math.random() > 0.5
		});
	}, 5000);
</script>

<div class="flex flex-col items-center w-full h-screen max-w-6xl mx-auto">
	<!-- Top half with image and valve indicators -->
	<div class="relative flex-grow w-full flex items-center justify-center">
		<img
			src="/src/lib/assets/liquid_engine.png"
			alt="Engine Layout"
			class="w-full h-auto object-contain"
		/>

		<!-- Valve indicators -->
		<div
			class="absolute rounded-full border-2 w-[2.5%] h-[2.5%] top-[12%] left-[25%]"
			class:bg-red-500={!valveStates.valve1}
			class:bg-green-500={valveStates.valve1}
		></div>
		<div
			class="absolute rounded-full border-2 w-[2.5%] h-[2.5%] top-[45%] left-[60%]"
			class:bg-red-500={!valveStates.valve2}
			class:bg-green-500={valveStates.valve2}
		></div>
	</div>

	<!-- Bottom half with state control and data display -->
	<div class="grid grid-cols-2 w-full mt-4 h-[30%]">
		<!-- State control buttons -->
		<div class="flex flex-col items-center justify-center space-y-4 bg-gray-100 p-4">
			<h2 class="text-2xl font-bold">State Control</h2>
			<div class="grid grid-cols-3 gap-2">
				<button class="btn variant-filled">Init</button>
				<button class="btn variant-filled">Fill</button>
				<button class="btn variant-filled">Fire</button>
				<button class="btn variant-filled">Purge</button>
				<button class="btn variant-filled">Abort</button>
				<button class="btn variant-filled">Overload</button>
			</div>
		</div>

		<!-- Data display for pressure and temperature -->
		<div class="flex flex-col items-center justify-center bg-gray-100 p-4">
			<h2 class="text-2xl font-bold">Received Data</h2>
			<div class="mt-4">
				<p class="text-lg">Pressure: <span id="pressure">120 psi</span></p>
				<p class="text-lg">Temperature: <span id="temperature">80°C</span></p>
			</div>
		</div>
	</div>
</div>
