import type { CollectionModel } from 'pocketbase';
import { writable } from 'svelte/store';

const collections = [
	'LinkStatus',
	'Air',
	'EkfNav1',
	'EkfNav2',
	'EkfQuat',
	'GpsVel',
	'Imu1',
	'Imu2',
	'Log',
	'State'
] as const;
type CollectionNames = (typeof collections)[number];

export const collectionFields = writable<Map<CollectionNames, CollectionModel>>(new Map());

fetch('/api/pb/schema').then(async (res) => {
	if (res.ok) {
		const collectionList: CollectionModel[] = await res.json();

		const collectionMap = new Map<CollectionNames, CollectionModel>();
		collectionList.forEach((collection) => {
			collectionMap.set(collection.name as CollectionNames, collection);
		});
		collectionFields.set(collectionMap);
	}
});
