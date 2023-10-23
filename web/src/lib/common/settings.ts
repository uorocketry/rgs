import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

// Settings type definitions

type ValueT =
	| {
			valueDescription: 'string';
			value: Writable<string>;
	  }
	| {
			valueDescription: 'number';
			value: Writable<number>;
	  }
	| {
			valueDescription: 'boolean';
			value: Writable<boolean>;
	  }
	| {
			valueDescription: 'array';
			value: Writable<string[]>;
	  }
	| {
			valueDescription: 'kv';
			value: Writable<{ [key: string]: string }>;
	  }
	| {
			valueDescription: 'enum';
			options: string[];
			value: Writable<string>;
	  };

type Setting = { name: string; description?: string } & ValueT;

type SettingsGroup = {
	name: string;
	settings: Setting[];
};

// Settings

const uiSettings = {
	name: 'ui',
	settings: [
		{
			name: 'sidebarLeft',
			description: 'Show side bar on the left side, otherwise on the right side',
			valueDescription: 'boolean',
			value: localStorageStore('ui.sidebarLeft', true)
		},
		{
			name: 'lightMode',
			description: 'Use light mode',
			valueDescription: 'boolean',
			value: localStorageStore('ui.lightMode', true)
		}
	]
} satisfies SettingsGroup;

const notificationSettings = {
	name: 'notifications',
	settings: [
		{
			name: 'consoleNotifications',
			description: 'Enable on-screen console notifications',
			valueDescription: 'boolean',
			value: localStorageStore('notifications.consoleNotifications', false)
		}
	]
} satisfies SettingsGroup;

export const settings = [uiSettings, notificationSettings];

// ui.sidebarLeft
export const findSetting = (name: string): Setting | undefined => {
	const groupName = name.split('.')[0];
	const group = settings.find((group) => group.name === groupName);
	if (group) {
		// Find setting in group
		const settingName = name.split('.')[1];
		const setting = group.settings.find((setting) => setting.name === settingName);
		if (setting) {
			return setting;
		}
	}

	return undefined;
};
