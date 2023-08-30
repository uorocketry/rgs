<script lang="ts">
	import { onInterval } from '$lib/common/utils';

	let startTimer = false;
	let initialCountDown = 0;
	let countDown = 0;
	let startTime: number;
	let timeString = '';
	let dialog: HTMLDialogElement | undefined;
	let paused = false;

	const padWithLeadingZero = (num: number) => num.toString().padStart(2, '0');

	const formatTime = (ms: number) => {
		// Absolute everything
		let actualHours = Math.abs(ms / 1000 / 60 / 60);
		let actualMinutes = Math.abs((ms / 1000 / 60) % 60);
		let actualSeconds = Math.abs((ms / 1000) % 60);
		let actualMilliseconds = Math.abs(ms % 1000);

		// Round to nearest integer
		actualHours = Math.floor(actualHours);
		actualMinutes = Math.floor(actualMinutes);
		actualSeconds = Math.floor(actualSeconds);
		actualMilliseconds = Math.floor(actualMilliseconds);

		const hours = padWithLeadingZero(actualHours);
		const minutes = padWithLeadingZero(actualMinutes);
		const seconds = padWithLeadingZero(actualSeconds);
		let milliseconds = actualMilliseconds.toString();
		milliseconds = milliseconds.padStart(3, '0');

		const sign = countDown > 0 ? '-' : '+';
		return `${sign}${hours}:${minutes}:${seconds}.${milliseconds}`;
	};

	let timePaused = 0;

	onInterval(() => {
		if (paused) {
			timePaused += 10;
			return;
		}
		if (startTimer) {
			const elapsed = Date.now() - startTime;
			countDown = initialCountDown - elapsed + timePaused;

			timeString = formatTime(countDown);
		} else {
			timeString = formatTime(initialCountDown);
		}
	}, 10);
</script>

<div class="flex flex-row gap-2">
	<div class="tooltip tooltip-bottom" data-tip="Play/Pause">
		<label class="swap swap-rotate btn btn-outline">
			<!-- this hidden checkbox controls the state -->
			<input type="checkbox" bind:checked={paused} />

			<!-- volume on icon -->
			<i class="fa-solid fa-pause swap-on" />

			<i class="fa-solid fa-play swap-off" />
		</label>
	</div>

	<div class="tooltip tooltip-bottom" data-tip="Time Remaining">
		<button
			class="{countDown > 0 ? 'text-red-500' : 'text-green-500'} btn btn-outline"
			on:click={() => {
				dialog?.showModal();
			}}
		>
			{timeString}
		</button>
	</div>
</div>

<dialog class="modal" bind:this={dialog}>
	<form
		method="dialog"
		class="modal-box"
		on:submit={(e) => {
			const time = e.target[0].value;
			if (time !== '') {
				initialCountDown = parseInt(time) * 1000;
				countDown = initialCountDown;
				timePaused = 0;
				paused = false;
				startTime = Date.now();
				startTimer = true;
			}
		}}
	>
		<h3 class="text-lg font-bold">Count Down Timer</h3>
		<p class="py-4">Timer:</p>
		<input
			type="number"
			class="input input-bordered bg-gray-100 p-2 rounded mb-2"
			placeholder="Enter time in seconds"
		/>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
