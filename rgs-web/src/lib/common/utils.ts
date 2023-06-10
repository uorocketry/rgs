import { onDestroy } from 'svelte';
import { writable, type Unsubscriber, type Writable } from 'svelte/store';

export let theme: Writable<string> = writable();

export function onThemeChange(callback: () => void) {
	let unsubscribe = theme.subscribe(callback);
	onDestroy(() => {
		unsubscribe();
	});
	return unsubscribe;
}

export function onInterval(callback: () => void, milliseconds: number) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
	let unsubscriber: Unsubscriber = () => {
		clearInterval(interval);
	};
	return unsubscriber;
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
