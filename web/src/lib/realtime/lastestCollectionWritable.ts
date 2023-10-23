// initialLaunchPosition.js
import { lastCollectionRecord } from '$lib/common/utils';
import { pb } from '$lib/stores';
import { writable, type Writable } from 'svelte/store';
import type { CollectionResponses, Collections } from '../common/pocketbase-types';

export function latestCollectionWritable<T extends Collections>(
	collectionName: T
): Writable<CollectionResponses[T] | undefined> {
	return writable<CollectionResponses[T] | undefined>(undefined, (set) => {
		// Set the last value from the collection
		lastCollectionRecord<T>(collectionName).then((row) => {
			if (row) {
				set(row);
			}
		});

		const unsub = pb.collection(collectionName).subscribe<CollectionResponses[T]>('*', (msg) => {
			if (msg.action === 'create') {
				const row = msg.record;
				set(row);
			}
		});

		return async () => {
			(await unsub)();
		};
	});
}
