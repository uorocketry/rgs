<div class="grid-background"></div>

<style>
	.grid-background {
		position: fixed;
		z-index: -1;
		pointer-events: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image:
			repeating-linear-gradient(0deg, rgba(117,117,117,0.12) 0, rgba(117,117,117,0.12) 1px, transparent 1px, transparent 50px),
			repeating-linear-gradient(90deg, rgba(117,117,117,0.12) 0, rgba(117,117,117,0.12) 1px, transparent 1px, transparent 50px);
		background-size: 50px 50px, 50px 50px, 200px 200px;
		background-position: 0 0, 0 0, 0 0;
		animation: gridMove 15s linear infinite, gridGlow 10s linear infinite;
	}

	@keyframes gridMove {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 200px 200px;
		}
	}

	@keyframes gridGlow {
		0%, 100% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.2) drop-shadow(0 0 4px #fff8);
		}
	}
</style>
