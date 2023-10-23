import PocketBase from 'pocketbase';
import { writable, type Writable } from 'svelte/store';

// [url]/db/ is proxied to the DB server
export const pb = new PocketBase(window.location.origin + '/db/');
pb.admins.authWithPassword('admin@admin.com', 'admin');

export const commandBoxToggle: Writable<unknown> = writable();
