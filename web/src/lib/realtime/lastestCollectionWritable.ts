// initialLaunchPosition.js
import type { CollectionResponses } from '$lib/common/pocketbase-types';
import { lastCollectionRecord } from '$lib/common/utils';
import { pb } from '$lib/stores';
import { writable, type Writable } from 'svelte/store';
import type { Collections } from '../common/pocketbase-types';

export function latestCollectionWritable<T extends Collections, Z = undefined>(
	collectionName: T,
	defaultVal: Z | undefined = undefined,
): Writable<CollectionResponses[T] | Z> {
	return writable<CollectionResponses[T] | Z>(defaultVal, (set) => {
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
