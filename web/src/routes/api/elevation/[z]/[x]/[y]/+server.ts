// api/tiles/[z]/[x]/[y]/+server.ts
import { LRUCache } from '$lib/common/LRUCache';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFile } from 'fs';

const dataDir = './data';
if (!existsSync(dataDir)) {
	mkdirSync(dataDir);
}
const tilesDir = './data/elevation';
// Initialize ./data/tiles directory if it doesn't exist
if (!existsSync(tilesDir)) {
	mkdirSync(tilesDir);
}

console.log('Reading tiles cached files from: ', tilesDir);
const downloadedTiles = new Set(readdirSync(tilesDir));
const cache = new LRUCache<string, ArrayBufferLike>(4000); // Save up to 4_000 tiles in memory
console.log('Cache has tiles: ', downloadedTiles.size);
function getTileFileName(z: string, x: string, y: string) {
	const f = `${z}-${x}-${y}`;
	if (!f.endsWith('.png')) {
		return `${f}.png`;
	}
	return f;
}

async function getTerrainImage(z: string, x: string, y: string): Promise<ArrayBufferLike> {
	const fileName = getTileFileName(z, x, y);
	const cached = cache.get(fileName);
	// Image is in memory
	if (cached) {
		return cached;
	}

	// 	// Image is on disk
	if (downloadedTiles.has(fileName)) {
		const buffer = readFileSync(`${tilesDir}/${fileName}`);
		cache.put(fileName, buffer);
		return buffer;
	}

	// https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png

	// 	// Download tile from MapZen
	// const urlTemplate = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
	// https://s3.amazonaws.com/elevation-tiles-prod/normal/{z}/{x}/{y}.png
	const urlTemplate = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

	const url = urlTemplate.replace('{z}', z).replace('{x}', x).replace('{y}', y);
	const res = await fetch(url);
	console.log('Downloading ELEVATION from: ', url);
	const buffer = Buffer.from(await res.arrayBuffer());
	cache.put(fileName, buffer);
	writeFile(`${tilesDir}/${fileName}`, buffer, (err) => {
		if (err) {
			console.error('Error writing file  "', fileName, '" because: ', err);
		} else {
			downloadedTiles.add(fileName);
		}
	});

	return buffer;
}

export async function GET(req) {
	//

	const z = req.params.z;
	const x = req.params.x;
	const y = req.params.y.replace('.png', '').replace('.pbf', '');
	const img = await getTerrainImage(z, y, x);
	return new Response(img);
}
