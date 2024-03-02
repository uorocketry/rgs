// api/tiles/[z]/[x]/[y]/+server.ts
import { PUBLIC_CESIUM_TERRAIN_ENDPOINT, PUBLIC_CESIUM_TOKEN } from '$env/static/public';
import { LRUCache } from '$lib/common/LRUCache';
import type { RequestEvent } from '@sveltejs/kit';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFile } from 'fs';

// const dataDir = './data';
// if (!existsSync(dataDir)) {
// 	mkdirSync(dataDir);
// }
// const tilesDir = './data/elevation';
// // Initialize ./data/tiles directory if it doesn't exist
// if (!existsSync(tilesDir)) {
// 	mkdirSync(tilesDir);
// }

// console.log('Reading tiles cached files from: ', tilesDir);
// const downloadedTiles = new Set(readdirSync(tilesDir));
// const cache = new LRUCache<string, ArrayBufferLike>(4000); // Save up to 4_000 tiles in memory
// console.log('Cache has tiles: ', downloadedTiles.size);
// function getTileFileName(z: string, x: string, y: string) {
// 	const f = `${z}-${x}-${y}`;
// 	if (!f.endsWith('.png')) {
// 		return `${f}.png`;
// 	}
// 	return f;
// }

// 'https://assets.ion.cesium.com/us-east-1/asset_depot/1/CesiumWorldTerrain/v1.2/?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZWUwMzBjZS0xNjYzLTQyMTUtODA1Yi01YzgwN2Y3YTM2N2YiLCJpZCI6MjU5LCJhc3NldElkIjoxLCJhc3NldHMiOnsiMSI6eyJ0eXBlIjoiVEVSUkFJTiIsInByZWZpeCI6IkNlc2l1bVdvcmxkVGVycmFpbi92MS4yIiwiZXh0ZW5zaW9ucyI6W3RydWUsdHJ1ZSx0cnVlXSwicHVsbEFwYXJ0VGVycmFpbiI6ZmFsc2V9fSwic3JjIjoiNjE4ZmRiYjYtZDA0ZS00OGRjLWI1NDctMjU5YzIzNTc5YjdjIiwiaWF0IjoxNzA5MzkzMDQ5LCJleHAiOjE3MDkzOTY2NDl9.NaHUefEXYFLhhUdh6OFdRzlUdh5j2japmq1hInW3CQE'

async function getTerrainImage(
	req: RequestEvent,
	z: string,
	x: string,
	y: string
): Promise<ArrayBufferLike> {
	// const fileName = getTileFileName(z, x, y);
	// const cached = cache.get(fileName);
	// // Image is in memory
	// if (cached) {
	// 	return cached;
	// }

	// // 	// Image is on disk
	// if (downloadedTiles.has(fileName)) {
	// 	const buffer = readFileSync(`${tilesDir}/${fileName}`);
	// 	cache.put(fileName, buffer);
	// 	return buffer;
	// }

	// Download tile from Cesium ion
	const urlTemplate = PUBLIC_CESIUM_TERRAIN_ENDPOINT + `${z}/${x}/${y}.terrain`;
	// let url = urlTemplate.replace('{{z}}', z).replace('{x}', x).replace('{y}', y);
	const url = urlTemplate + '?v=1.2.0&access_token=' + PUBLIC_CESIUM_TOKEN;
	// Fetch with access token as bearer
	const res = await fetch(url, {
		...req.request,
		headers: {
			Authorization: 'Bearer ' + PUBLIC_CESIUM_TOKEN
		}
	});
	// https://assets.ion.cesium.com/us-east-1/asset_depot/1/CesiumWorldTerrain/v1.2/0/0/0.terrain?extensions=octvertexnormals-watermask-metadata&v=1.2.0
	if (!res.ok) {
		console.error('Error downloading ELEVATION from: ', url, ' because: ', res.statusText);
	}
	console.log(res.status);

	console.log('Downloading ELEVATION');
	const buffer = Buffer.from(await res.arrayBuffer());
	// cache.put(fileName, buffer);
	// writeFile(`${tilesDir}/${fileName}`, buffer, (err) => {
	// 	if (err) {
	// 		console.error('Error writing file  "', fileName, '" because: ', err);
	// 	} else {
	// 		downloadedTiles.add(fileName);
	// 	}
	// });

	return buffer;
}

export async function GET(req) {
	console.log(req.url);
	const z = req.params.z;
	const x = req.params.x;
	const y = req.params.y.replace('.png', '').replace('.pbf', '').replace('.terrain', '');
	const img = await getTerrainImage(req, z, y, x);
	return new Response(img);
}
