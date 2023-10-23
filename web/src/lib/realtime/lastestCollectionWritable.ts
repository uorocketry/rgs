// initialLaunchPosition.js
import { lastCollectionRecord } from '$lib/common/utils';
import { pb } from '$lib/stores';
import { writable, type Writable } from 'svelte/store';
import type { CollectionResponses, Collections } from '../common/pocketbase-types';

// We need to use a type that allows for undefined values
// as the collection may not have any records yet
export type MaybeAll<ObejctType> = {
	[Key in keyof ObejctType]?: ObejctType[Key];
};

export function latestCollectionWritable<T extends Collections>(
	collectionName: T
): Writable<MaybeAll<CollectionResponses[T]>> {
	return writable<CollectionResponses[T] | {}>({}, (set) => {
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
