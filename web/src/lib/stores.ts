import PocketBase from 'pocketbase';
import { writable, type Writable } from 'svelte/store';
import type { TypedPocketBase } from './common/pocketbase-types';

// [url]/db/ is proxied to the DB server
//http://0.0.0.0:3001/_/
// export const pb = new PocketBase(window.location.origin + '/db/');
export const pb = new PocketBase('http://localhost:3001/') as TypedPocketBase;
pb.admins.authWithPassword('admin@admin.com', 'admin');

export const commandBoxToggle: Writable<unknown> = writable();
