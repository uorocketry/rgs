import PocketBase from 'pocketbase';
import { writable, type Writable } from 'svelte/store';
import type { TypedPocketBase } from './common/pocketbase-types';

export const pb = new PocketBase('http://' + window.location.hostname + ':8090') as TypedPocketBase;
pb.admins.authWithPassword('admin@admin.com', 'admin');

export const commandBoxToggle: Writable<unknown> = writable();
