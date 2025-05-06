<script lang="ts">
	// No special logic needed for now
</script>

<div class="p-4 h-full flex flex-col">
	<h1 class="text-2xl font-bold mb-4">Map Downloader</h1>
	<iframe
		src="http://localhost:6565/"
		title="Map Download Page"
		class="flex-1 w-full border rounded-lg shadow"
		style="min-height: 70vh; background: white;"
		allowfullscreen
	></iframe>
	<p class="mt-2 text-xs text-gray-500">
		If the map download page does not load, ensure the service at <code>http://localhost:6565/</code
		> is running.
	</p>
</div>

<style>
	iframe {
		border: 1px solid #e5e7eb;
	}
</style>
