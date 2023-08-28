// initialLaunchPosition.js
import { pb } from '$lib/stores';
import { writable, type Writable } from 'svelte/store';
import type { Record } from 'pocketbase';

const identity = (x: any) => x;
export function latestCollectionWritable<T>(collectionName: string, defaultVal: T | undefined, setterFunc: (row: Record) => T = identity): Writable<T> {

    return writable<T>(defaultVal, (set) => {
        const unsub = pb.collection(collectionName).subscribe("*", (msg) => {
            if (msg.action === "create") {
                const row = msg.record;
                set(setterFunc(row));
            }
        });

        return async () => {
            (await unsub)();
        }

    });
}
