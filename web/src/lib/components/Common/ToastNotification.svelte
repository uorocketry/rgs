<script lang="ts">
	import type { Toast } from '$lib/stores/toastStore';
	import { toastStore } from '$lib/stores/toastStore';

	type $$Props = {
		toast: Toast;
	};
	let { toast }: $$Props = $props();

	const alertClasses = {
		info: 'alert-info',
		success: 'alert-success',
		warning: 'alert-warning',
		error: 'alert-error'
	};

	function close() {
		toastStore.remove(toast.id);
	}
</script>

<div class="alert {alertClasses[toast.type]} shadow-lg mb-2 fade-in-out">
	<span class="flex-1">{toast.message}</span>
	<button class="btn btn-sm btn-ghost btn-circle" onclick={close} aria-label="Close">
		<i class="fa-solid fa-xmark"></i>
	</button>
</div>

<style>
	.fade-in-out {
		animation:
			fadeIn 0.5s ease-out,
			fadeOut 0.5s ease-in 2.5s forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-10px);
		}
	}
</style>
