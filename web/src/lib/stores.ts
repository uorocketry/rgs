import PocketBase from 'pocketbase';
import { writable, type Writable } from 'svelte/store';


export const pb = new PocketBase('http://192.168.1.145:8090');
pb.admins.authWithPassword('admin@admin.com', 'admin');

export const commandBoxToggle: Writable<unknown> = writable();