import PocketBase from 'pocketbase';
import { writable, type Writable } from 'svelte/store';

export const pb = new PocketBase('http://' + window.location.hostname + ':8090');
pb.admins.authWithPassword('admin@admin.com', 'admin');

export const commandBoxToggle: Writable<unknown> = writable();