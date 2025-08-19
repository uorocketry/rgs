import { writable } from 'svelte/store';
import type { DockPanel } from '@lumino/widgets';
import type { Widget as WidgetType } from '@lumino/widgets';

// Define the structure for a widget configuration
export interface WidgetConfig {
	id: string; // Unique ID for the widget
	componentName: string; // Key from dashboard_components
	title: string;
	// Optional Lumino layout options (add more as needed)
	options?: {
		mode?: DockPanel.InsertMode;
		ref?: WidgetType | string | null; // Allow string ID initially, resolve later if needed
	};
}

// Define the initial state (e.g., start with Map and RocketStatus)
const initialWidgets: WidgetConfig[] = [

	{
		id: 'navball-widget-initial',
		componentName: 'RocketNavBall',
		title: 'RocketNavBall'
		// No initial options
	}
];

// Create the writable store
export const widgetStore = writable<WidgetConfig[]>(initialWidgets);

// Optional: Helper function to add a widget (can be called from actions)
export function addWidgetToStore(config: WidgetConfig) {
	widgetStore.update(widgets => [...widgets, config]);
}

// Optional: Helper function to remove a widget (could be triggered by Lumino events later)
export function removeWidgetFromStore(widgetId: string) {
	widgetStore.update(widgets => widgets.filter(w => w.id !== widgetId));
} 