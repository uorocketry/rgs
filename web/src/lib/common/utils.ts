import { pb } from '$lib/stores';
import type { LatLngLiteral } from 'leaflet';
import type { RecordSubscription } from 'pocketbase';
import { onDestroy, onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { CollectionRecords, CollectionResponses, Collections } from './pocketbase-types';

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

export function onCollection<T>(
	collection: string,
	callback: (msg: RecordSubscription<T>) => void
) {
	onMount(() => {
		const unsubscribe = pb.collection(collection).subscribe('*', (msg) => {
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

export async function lastCollectionRecord<T extends Collections>(
	collection: T
): Promise<CollectionRecords[T] | undefined> {
	const ret = await pb.collection(collection).getList<CollectionResponses[T]>(1, 1, {
		sort: '-created',
		$autoCancel: false
	});
	if (ret.items.length === 0) {
		return undefined;
	} else {
		const rec = ret.items[0];
		return rec as CollectionRecords[T];
	}
}

export function formatVariableName(name: string): string {
	return name
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

// ThisIsCamelCase -> This Is Camel Case
export function formatCamelCase(name: string): string {
	return name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
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

export function max(a: number, b: number) {
	return a > b ? a : b;
}

export function haversineDistance(coord1: LatLngLiteral, coord2: LatLngLiteral): number {
	const R = 6371; // Radius of the Earth in km
	const dLat = toRad(coord2.lat - coord1.lat);
	const dLon = toRad(coord2.lng - coord1.lng);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(coord1.lat)) *
			Math.cos(toRad(coord2.lat)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function toRad(v: number) {
	return (v * Math.PI) / 180;
}

export function roundToDecimalPlaces(num: number, decimalPlaces: number) {
	const factor = Math.pow(10, decimalPlaces);
	return Math.round(num * factor) / factor;
}

// 1.04, 3 -> 1.040
// 1.5, 2 -> 1.50
export function padFloatToDecimalPlaces(num: number, decimalPlaces: number) {
	const factor = Math.pow(10, decimalPlaces);
	return (Math.round(num * factor) / factor).toFixed(decimalPlaces);
}
