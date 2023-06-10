import { pb } from '$lib/stores';
import { writable } from 'svelte/store';

const collections = ['link_status', 'sbg', 'state'] as const;
type Collection = (typeof collections)[number];

export const collectionFields = writable<Map<Collection, string[]>>(new Map());
export const minMaxCreated = writable<Map<Collection, [number, number]>>(new Map());

(async () => {
	const map = new Map<Collection, string[]>();
	let firstItems = await Promise.all(
		collections.map((collection) =>
			pb.collection(collection).getFirstListItem('', {
				sort: 'created',
				$autoCancel: false
			})
		)
	);

	let lastItems = await Promise.all(
		collections.map((collection) =>
			pb.collection(collection).getFirstListItem('', {
				sort: '-created',
				$autoCancel: false
			})
		)
	);

	// Get collection fields
	for (let i = 0; i < collections.length; i++) {
		map.set(collections[i], Object.keys(firstItems[i]));
	}
	collectionFields.set(map);

	// Get min and max created
	const minMaxMap = new Map<Collection, [number, number]>();
	for (let i = 0; i < collections.length; i++) {
		minMaxMap.set(collections[i], [Number(firstItems[i].created), Number(lastItems[i].created)]);
	}

	minMaxCreated.set(minMaxMap);
})();
