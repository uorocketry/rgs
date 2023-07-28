<script lang="ts">
	import { onSocket } from '$lib/common/socket';
	import type { Data } from '@rgs/bindings';
	import { onMount } from 'svelte';
	// import { socket } from '$lib/common/socket';

	// Send post to server -> api/zmq_mock
	function sendPost() {
		console.log();

		const url = `${import.meta.env.BASE_URL}api/zmq`;
		const data: Data = {
			log: {
				level: 'Info',
				event: {
					Error: 'GroundStation'
				}
			}
		};

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' }
		});
	}

	onMount(() => {
		console.log('mounted');
		// socket?.emit('ping');
	});

	// onSocket('ping', (t) => {
	// console.log('pong at ' + t);
	// });
</script>

<!-- button to send -->
<button on:click={sendPost}>Send</button>
```
