<script>
	// Get base url without port
	let baseUri = window.location.origin;
	baseUri = baseUri.substring(0, baseUri.lastIndexOf(':'));
	// use http instead of https
	baseUri = baseUri.replace('https', 'http');
</script>

<iframe title="hasura" class="w-full h-full" src="{baseUri}:4000/console"></iframe>
