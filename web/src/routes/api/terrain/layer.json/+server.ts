import { PUBLIC_CESIUM_TERRAIN_ENDPOINT, PUBLIC_CESIUM_TOKEN } from '$env/static/public';
import layerText from './layer.json';

export async function GET(req) {
	// Proxy to
	// PUBLIC_CESIUM_TERRAIN_ENDPOINT + '/layer.json?access_token=' + PUBLIC_CESIUM_TOKEN.

	const url = PUBLIC_CESIUM_TERRAIN_ENDPOINT + 'layer.json?access_token=' + PUBLIC_CESIUM_TOKEN;
	console.log('Fetching layer from: ', url);
	const r = await fetch(url, {
		...req.request
		// body: JSON.stringify({
		// 	access_token: PUBLIC_CESIUM_TOKEN
		// })
	});

	if (!r.ok) {
		console.error('Error downloading layer from: ', url, ' because: ', r.statusText);
		throw new Error('Error downloading layer from: ' + url + ' because: ' + r.statusText);
	} else {
		console.log('Downloading layer');
	}

	// const body = await r.text();
	return new Response(JSON.stringify(layerText));
}
