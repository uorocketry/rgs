<script lang="ts">
	let iframeLoaded = $state(false);
	let iframeError = $state(false);
</script>

<iframe
	src="/tiles/downloader"
	title="Map Downloader"
	class="h-full w-full"
	allowfullscreen
	onload={() => iframeLoaded = true}
	onerror={() => iframeError = true}
></iframe>
{#if !iframeLoaded}
	<p class="mt-2 text-xs text-gray-500">
		If the map download page does not load, ensure the service at <code>http://localhost:6565/</code> is running.
	</p>
{/if}

<style>
	iframe {
		border: 0;
	}
</style> 