// initialLaunchPosition.js
import { lastCollectionRecord } from '$lib/common/utils';
import { pb } from '$lib/stores';
import type { RecordModel } from 'pocketbase';
import { writable, type Writable } from 'svelte/store';
import type { CollectionRecords, Collections } from '../common/pocketbase-types';

const identity = (x: unknown) => x;
export function latestCollectionWritable<T extends Collections, Z = undefined>(
	collectionName: T,
	defaultVal: Z | undefined = undefined,
	setterFunc: (row: RecordModel) => unknown = identity
): Writable<CollectionRecords[T] | Z> {
	return writable<CollectionRecords[T] | Z>(defaultVal, (set) => {
		// Set the last value from the collection
		lastCollectionRecord(collectionName).then((row) => {
			if (row) {
				set(setterFunc(row as RecordModel) as CollectionRecords[T]);
			}
		});

		const unsub = pb.collection(collectionName).subscribe('*', (msg) => {
			if (msg.action === 'create') {
				const row = msg.record;
				set(setterFunc(row) as CollectionRecords[T]);
			}
		});

		return async () => {
			(await unsub)();
		};
	});
}
