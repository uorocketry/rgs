// initialLaunchPosition.js
import { lastCollectionRecord } from '$lib/common/utils';
import { pb } from '$lib/stores';
import type { RecordModel } from 'pocketbase';
import { writable, type Writable } from 'svelte/store';
import type { Collections } from '../common/pocketbase-types';

const identity = (x: unknown) => x;
export function latestCollectionWritable<T>(
	collectionName: Collections,
	defaultVal: T | undefined,
	setterFunc: (row: RecordModel) => unknown = identity
): Writable<T> {
	return writable<T>(defaultVal, (set) => {
		// Set the last value from the collection
		lastCollectionRecord(collectionName).then((row) => {
			if (row) {
				set(setterFunc(row as RecordModel) as T);
			}
		});

		const unsub = pb.collection(collectionName).subscribe('*', (msg) => {
			if (msg.action === 'create') {
				const row = msg.record;
				set(setterFunc(row) as T);
			}
		});

		return async () => {
			(await unsub)();
		};
	});
}
