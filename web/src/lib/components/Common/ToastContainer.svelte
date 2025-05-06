<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import ToastNotification from './ToastNotification.svelte';

	const toasts = toastStore; // Directly use the store
</script>

{#if $toasts.length > 0}
	<div class="toast toast-top toast-end z-50">
		{#each $toasts as toast (toast.id)}
			<ToastNotification {toast} />
		{/each}
	</div>
{/if}
