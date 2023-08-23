<script lang="ts">
	import { onInterval } from '$lib/common/utils';

	let startTimer = false;
	let initialCountDown = 0;
	let countDown = 0;
	let startTime: number;
	let timeString = '';

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

	onInterval(() => {
		if (startTimer) {
			const elapsed = Date.now() - startTime;
			countDown = initialCountDown - elapsed;
			timeString = formatTime(countDown);
		} else {
			timeString = formatTime(initialCountDown);
		}
	}, 10);
</script>

<div class="font-mono">
	<div class="tooltip tooltip-left" data-tip="Time Remaining">
		<label for="my-modal-4" class="{countDown > 0 ? 'text-red-500' : 'text-green-500'} btn">
			{timeString}
		</label>

		<input type="checkbox" id="my-modal-4" class="modal-toggle" />
		<label for="my-modal-4" class="modal cursor-pointer">
			<div class="modal-box">
				<h3 class="text-lg font-bold">Count Down Timer</h3>
				<p class="py-4">Timer:</p>
				<input
					type="number"
					class="input input-bordered bg-gray-100 p-2 rounded mb-2"
					placeholder="Enter time in seconds"
					on:change={(e) => {
						if (e.target.value !== '') {
							initialCountDown = parseInt(e.target.value) * 1000;
							countDown = initialCountDown;
						}
					}}
				/>

				<div class="mb-2">
					<label class="btn bg-black">
						<input
							type="checkbox"
							class="sr-only"
							bind:checked={startTimer}
							on:change={() => {
								if (startTimer) {
									startTime = Date.now();
								} else {
									countDown = initialCountDown;
								}
							}}
						/>
						<span class="text-white">{startTimer ? 'Stop Timer' : 'Start Timer'}</span>
					</label>
				</div>
			</div>
		</label>
	</div>
</div>
