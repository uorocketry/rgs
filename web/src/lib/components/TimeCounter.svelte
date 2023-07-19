<script lang="ts">
	import { onInterval } from '$lib/common/utils';

	// In 2 minutes, the timeRemaining will be 0
	let targetTime = Date.now() + 5 * 1000;
	let countDown = targetTime - Date.now();
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
		countDown = targetTime - Date.now();
		timeString = formatTime(countDown);
	}, 10);
</script>

<div>
	<div class="tooltip tooltip-left" data-tip="Time Remaining">
		<span class="{countDown > 0 ? 'text-red-500' : 'text-green-500'} btn">{timeString}</span>
	</div>
</div>
