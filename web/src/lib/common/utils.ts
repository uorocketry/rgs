import { pb } from '$lib/stores';
import type { RecordSubscription } from 'pocketbase';
import { onDestroy, onMount } from 'svelte';
import { writable, type Unsubscriber, type Writable } from 'svelte/store';

export const theme: Writable<string> = writable();

export function onThemeChange(callback: () => void) {
	const unsubscribe = theme.subscribe(callback);
	onDestroy(() => {
		unsubscribe();
	});
	return unsubscribe;
}

export function onInterval(callback: () => void, milliseconds: number) {
	onMount(() => {
		const interval = setInterval(callback, milliseconds);
		return () => {
			clearInterval(interval);
		};
	});
}

export function onCollection<T>(collection: string, callback: (msg: RecordSubscription<T>) => void) {
	onMount(() => {
		const unsubscribe = pb.collection(collection).subscribe("*", (msg) => {
			msg.record = unflattenObjectWithArray(msg.record)
			callback(msg as RecordSubscription<T>);
		});
		return async () => {
			(await unsubscribe)();
		};
	});
}

export function onCollectionCreated<T>(collection: string, callback: (msg: T) => void) {
	const createdFilter = (msg: RecordSubscription<T>) => {
		if (msg.action === 'create') {
			callback(msg.record);
		}
	};
	onCollection(collection, createdFilter);
}

export function formatVariableName(name: string): string {
	return name
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function getRandomHexColorFromString(str: string, contrastThreshold = 0.8): string {
	// Convert the string to a unique number by summing the character codes
	let num = 0;
	for (let i = 0; i < str.length; i++) {
		num += str.charCodeAt(i);
	}

	// Use the string-based number as the seed for the random number generator
	const random = Math.sin(num) * 10000;
	const randomNumber = Math.floor((random - Math.floor(random)) * 16777216);

	// Convert the random number to a hex color string
	const hexColor = '#' + randomNumber.toString(16).padStart(6, '0');

	// Calculate the relative luminance of the color
	const r = parseInt(hexColor.substring(1, 3), 16);
	const g = parseInt(hexColor.substring(3, 5), 16);
	const b = parseInt(hexColor.substring(5, 7), 16);
	const relativeLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

	// Adjust the color if the contrast is too low
	if (relativeLuminance > contrastThreshold) {
		return getRandomHexColorFromString(str + 'a', contrastThreshold);
	}

	return hexColor;
}

export function flattenObjectWithArray(obj: any) {
	const res: any = {};
	// Iterate over all keys in the object
	for (const key in obj) {
		const el = obj[key];
		// If not array copy to res
		if (!Array.isArray(el)) {
			res[key] = el;
		} else {
			// If array, iterate over all elements
			for (let i = 0; i < el.length; i++) {
				res[key + '_' + i] = el[i];
			}
		}
	}

	return res;
}

/**
 * Given an object containing elements with keys such as _0, _1, _2, etc.
 * merge them into an array. This is the inverse of flattenObjectWithArray.
 * @param obj
 */
export function unflattenObjectWithArray<T>(obj: any): T {
	const res: any = {};
	for (const key in obj) {
		const el = obj[key];
		// Regex match for keys with _0, _1, _2, etc.
		const match = key.match(/_\d+/);
		if (match) {
			const baseName = key.substring(0, match.index);
			res[baseName] = res[baseName] || [];
			res[baseName].push(el);
		} else {
			res[key] = el;
		}
	}
	return res;

}

export function max(a: number, b: number) {
	return a > b ? a : b;
}